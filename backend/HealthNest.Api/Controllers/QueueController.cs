using System.Security.Claims;
using HealthNest.Api.Data;
using HealthNest.Api.DTOs;
using HealthNest.Api.Hubs;
using HealthNest.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace HealthNest.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class QueueController : ControllerBase
{
    private const int AverageConsultationMinutes = 15;

    private readonly AppDbContext _db;
    private readonly IHubContext<AppointmentHub> _hub;

    public QueueController(AppDbContext db, IHubContext<AppointmentHub> hub)
    {
        _db = db;
        _hub = hub;
    }

    private int CurrentUserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [Authorize(Roles = "Patient")]
    [HttpPost("check-in/{appointmentId}")]
    public async Task<IActionResult> CheckIn(int appointmentId)
    {
        var appointment = await _db.Appointments
            .Include(a => a.TimeSlot)
            .Include(a => a.Patient)
            .FirstOrDefaultAsync(a => a.Id == appointmentId && a.PatientId == CurrentUserId);

        if (appointment is null) return NotFound();
        if (appointment.Status != AppointmentStatus.Confirmed) return BadRequest("Appointment is not confirmed.");

        appointment.CheckedIn = true;
        appointment.CheckedInAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        var doctorProfileId = appointment.TimeSlot!.DoctorProfileId;
        await BroadcastQueue(doctorProfileId);

        return Ok();
    }

    [HttpGet("doctor/{doctorProfileId}")]
    public async Task<ActionResult<List<QueueEntryDto>>> GetQueue(int doctorProfileId)
    {
        var queue = await BuildQueue(doctorProfileId);
        return Ok(queue);
    }

    [Authorize(Roles = "Patient")]
    [HttpGet("status/{appointmentId}")]
    public async Task<ActionResult<QueueStatusDto>> GetStatus(int appointmentId)
    {
        var appointment = await _db.Appointments
            .Include(a => a.TimeSlot)
            .FirstOrDefaultAsync(a => a.Id == appointmentId && a.PatientId == CurrentUserId);

        if (appointment is null || !appointment.CheckedIn) return NotFound();

        var queue = await BuildQueue(appointment.TimeSlot!.DoctorProfileId);
        var entry = queue.FirstOrDefault(q => q.AppointmentId == appointmentId);
        if (entry is null) return NotFound();

        var peopleAhead = entry.Position - 1;
        return Ok(new QueueStatusDto(appointmentId, entry.Position, peopleAhead, peopleAhead * AverageConsultationMinutes, appointment.TimeSlot!.DoctorProfileId));
    }

    [Authorize(Roles = "Doctor")]
    [HttpPost("next")]
    public async Task<IActionResult> CallNext()
    {
        var profile = await _db.DoctorProfiles.FirstOrDefaultAsync(d => d.UserId == CurrentUserId);
        if (profile is null) return NotFound();

        var next = await _db.Appointments
            .Include(a => a.TimeSlot)
            .Where(a => a.TimeSlot!.DoctorProfileId == profile.Id
                        && a.CheckedIn
                        && a.Status == AppointmentStatus.Confirmed)
            .OrderBy(a => a.CheckedInAt)
            .FirstOrDefaultAsync();

        if (next is null) return NotFound("No patients in queue.");

        next.Status = AppointmentStatus.Completed;
        await _db.SaveChangesAsync();

        await _hub.Clients.Group($"patient-{next.PatientId}")
            .SendAsync("AppointmentStatusChanged", next.Id, next.Status.ToString());

        await BroadcastQueue(profile.Id);

        return Ok();
    }

    private async Task<List<QueueEntryDto>> BuildQueue(int doctorProfileId)
    {
        var checkedIn = await _db.Appointments
            .Include(a => a.Patient)
            .Include(a => a.TimeSlot)
            .Where(a => a.TimeSlot!.DoctorProfileId == doctorProfileId
                        && a.CheckedIn
                        && a.Status == AppointmentStatus.Confirmed)
            .OrderBy(a => a.CheckedInAt)
            .ToListAsync();

        return checkedIn.Select((a, index) => new QueueEntryDto(
            a.Id, a.Patient!.FullName, index + 1, a.CheckedInAt!.Value, index == 0
        )).ToList();
    }

    private async Task BroadcastQueue(int doctorProfileId)
    {
        var queue = await BuildQueue(doctorProfileId);

        await _hub.Clients.Group($"queue-{doctorProfileId}").SendAsync("QueueUpdated", queue);
        await _hub.Clients.Group($"doctor-{doctorProfileId}").SendAsync("QueueUpdated", queue);

        var checkedInPatientIds = await _db.Appointments
            .Where(a => a.TimeSlot!.DoctorProfileId == doctorProfileId && a.CheckedIn && a.Status == AppointmentStatus.Confirmed)
            .Select(a => a.PatientId)
            .Distinct()
            .ToListAsync();

        foreach (var pid in checkedInPatientIds)
        {
            await _hub.Clients.Group($"patient-{pid}").SendAsync("QueueUpdated");
        }
    }
}
