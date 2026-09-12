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
public class DoctorsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IHubContext<AppointmentHub> _hub;

    public DoctorsController(AppDbContext db, IHubContext<AppointmentHub> hub)
    {
        _db = db;
        _hub = hub;
    }

    [HttpGet]
    public async Task<ActionResult<List<DoctorSummaryDto>>> GetDoctors([FromQuery] string? specialization)
    {
        var query = _db.DoctorProfiles.Include(d => d.User).AsQueryable();

        if (!string.IsNullOrWhiteSpace(specialization))
            query = query.Where(d => d.Specialization.Contains(specialization));

        var doctors = await query
            .Select(d => new DoctorSummaryDto(d.Id, d.User!.FullName, d.Specialization, d.ConsultationFee, d.Plan.ToString()))
            .ToListAsync();

        return Ok(doctors);
    }

    [Authorize(Roles = "Doctor")]
    [HttpGet("me")]
    public async Task<ActionResult<DoctorSummaryDto>> GetMyProfile()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var profile = await _db.DoctorProfiles.Include(d => d.User).FirstOrDefaultAsync(d => d.UserId == userId);
        if (profile is null) return NotFound();

        return Ok(new DoctorSummaryDto(profile.Id, profile.User!.FullName, profile.Specialization, profile.ConsultationFee, profile.Plan.ToString()));
    }

    [HttpGet("{doctorProfileId}/slots")]
    public async Task<ActionResult<List<TimeSlotDto>>> GetSlots(int doctorProfileId)
    {
        var slots = await _db.TimeSlots
            .Where(t => t.DoctorProfileId == doctorProfileId && t.StartTime > DateTime.UtcNow)
            .OrderBy(t => t.StartTime)
            .Select(t => new TimeSlotDto(t.Id, t.StartTime, t.EndTime, t.IsBooked))
            .ToListAsync();

        return Ok(slots);
    }

    [Authorize(Roles = "Doctor")]
    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile(DoctorProfileRequest request)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var profile = await _db.DoctorProfiles.FirstOrDefaultAsync(d => d.UserId == userId);
        if (profile is null) return NotFound();

        profile.Specialization = request.Specialization;
        profile.ConsultationFee = request.ConsultationFee;
        profile.Bio = request.Bio;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [Authorize(Roles = "Doctor")]
    [HttpPost("slots")]
    public async Task<IActionResult> AddSlot(TimeSlotRequest request)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var profile = await _db.DoctorProfiles.FirstOrDefaultAsync(d => d.UserId == userId);
        if (profile is null) return NotFound();

        var slot = new TimeSlot
        {
            DoctorProfileId = profile.Id,
            StartTime = request.StartTime,
            EndTime = request.EndTime
        };

        _db.TimeSlots.Add(slot);
        await _db.SaveChangesAsync();

        var slotDto = new TimeSlotDto(slot.Id, slot.StartTime, slot.EndTime, slot.IsBooked);
        await _hub.Clients.All.SendAsync("SlotAdded", slotDto);

        return Ok(slotDto);
    }
}
