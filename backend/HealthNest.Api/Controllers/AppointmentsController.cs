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
public class AppointmentsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IHubContext<AppointmentHub> _hub;

    public AppointmentsController(AppDbContext db, IHubContext<AppointmentHub> hub)
    {
        _db = db;
        _hub = hub;
    }

    private int CurrentUserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [Authorize(Roles = "Patient")]
    [HttpPost("book")]
    public async Task<IActionResult> Book(BookAppointmentRequest request)
    {
        var slot = await _db.TimeSlots
            .Include(t => t.DoctorProfile)!.ThenInclude(d => d!.User)
            .FirstOrDefaultAsync(t => t.Id == request.TimeSlotId);

        if (slot is null) return NotFound("Time slot not found.");

        var alreadyBooked = await _db.Appointments.AnyAsync(a => a.TimeSlotId == slot.Id);
        if (slot.IsBooked || alreadyBooked)
        {
            if (!slot.IsBooked)
            {
                slot.IsBooked = true;
                await _db.SaveChangesAsync();
            }
            return BadRequest("This slot is already booked.");
        }

        slot.IsBooked = true;

        var appointment = new Appointment
        {
            PatientId = CurrentUserId,
            TimeSlotId = slot.Id,
            Status = AppointmentStatus.Confirmed
        };

        _db.Appointments.Add(appointment);

        try
        {
            await _db.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            return BadRequest("This slot is already booked.");
        }

        var patient = await _db.Users.FindAsync(CurrentUserId);

        var appointmentDto = new AppointmentDto(
            appointment.Id, slot.DoctorProfile!.User!.FullName, patient!.FullName,
            slot.StartTime, slot.EndTime, appointment.Status.ToString());

        await _hub.Clients.Group($"doctor-{slot.DoctorProfileId}")
            .SendAsync("NewAppointment", appointmentDto);

        await _hub.Clients.All.SendAsync("SlotBooked", slot.Id);

        return Ok(appointmentDto);
    }

    [Authorize(Roles = "Doctor")]
    [HttpGet("doctor")]
    public async Task<ActionResult<List<AppointmentDto>>> GetDoctorAppointments()
    {
        var profile = await _db.DoctorProfiles.FirstOrDefaultAsync(d => d.UserId == CurrentUserId);
        if (profile is null) return NotFound();

        var appointments = await _db.Appointments
            .Include(a => a.Patient)
            .Include(a => a.TimeSlot)
            .Where(a => a.TimeSlot!.DoctorProfileId == profile.Id)
            .Select(a => new AppointmentDto(a.Id, profile.Specialization, a.Patient!.FullName,
                a.TimeSlot!.StartTime, a.TimeSlot.EndTime, a.Status.ToString()))
            .ToListAsync();

        return Ok(appointments);
    }

    [Authorize(Roles = "Patient")]
    [HttpGet("patient")]
    public async Task<ActionResult<List<AppointmentDto>>> GetPatientAppointments()
    {
        var appointments = await _db.Appointments
            .Include(a => a.TimeSlot)!.ThenInclude(t => t!.DoctorProfile)!.ThenInclude(d => d!.User)
            .Where(a => a.PatientId == CurrentUserId)
            .Select(a => new AppointmentDto(a.Id, a.TimeSlot!.DoctorProfile!.User!.FullName, "You",
                a.TimeSlot.StartTime, a.TimeSlot.EndTime, a.Status.ToString()))
            .ToListAsync();

        return Ok(appointments);
    }

    [Authorize(Roles = "Doctor")]
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] AppointmentStatus status)
    {
        var appointment = await _db.Appointments
            .Include(a => a.TimeSlot)
            .Include(a => a.Patient)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (appointment is null) return NotFound();

        appointment.Status = status;
        if (status == AppointmentStatus.Cancelled)
            appointment.TimeSlot!.IsBooked = false;

        await _db.SaveChangesAsync();

        await _hub.Clients.Group($"patient-{appointment.PatientId}")
            .SendAsync("AppointmentStatusChanged", appointment.Id, status.ToString());

        return NoContent();
    }
}
