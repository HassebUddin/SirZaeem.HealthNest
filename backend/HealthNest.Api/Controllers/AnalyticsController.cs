using HealthNest.Api.Data;
using HealthNest.Api.DTOs;
using HealthNest.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HealthNest.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AnalyticsController : ControllerBase
{
    private readonly AppDbContext _db;

    public AnalyticsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("summary")]
    public async Task<ActionResult<AnalyticsSummaryDto>> GetSummary()
    {
        var appointments = await _db.Appointments
            .Include(a => a.TimeSlot)!.ThenInclude(t => t!.DoctorProfile)
            .ToListAsync();

        var totalRevenue = appointments
            .Where(a => a.Status == AppointmentStatus.Completed)
            .Sum(a => a.TimeSlot?.DoctorProfile?.ConsultationFee ?? 0);

        var summary = new AnalyticsSummaryDto(
            TotalAppointments: appointments.Count,
            TotalDoctors: await _db.DoctorProfiles.CountAsync(),
            TotalPatients: await _db.Users.CountAsync(u => u.Role == UserRole.Patient),
            TotalRevenue: totalRevenue,
            PendingAppointments: appointments.Count(a => a.Status == AppointmentStatus.Pending),
            ConfirmedAppointments: appointments.Count(a => a.Status == AppointmentStatus.Confirmed),
            CancelledAppointments: appointments.Count(a => a.Status == AppointmentStatus.Cancelled),
            CompletedAppointments: appointments.Count(a => a.Status == AppointmentStatus.Completed)
        );

        return Ok(summary);
    }

    [HttpGet("top-doctors")]
    public async Task<ActionResult<List<TopDoctorDto>>> GetTopDoctors()
    {
        var appointments = await _db.Appointments
            .Include(a => a.TimeSlot)!.ThenInclude(t => t!.DoctorProfile)!.ThenInclude(d => d!.User)
            .Where(a => a.TimeSlot != null && a.TimeSlot.DoctorProfile != null)
            .ToListAsync();

        var data = appointments
            .GroupBy(a => a.TimeSlot!.DoctorProfile!.Id)
            .Select(g =>
            {
                var doctor = g.First().TimeSlot!.DoctorProfile!;
                var completedCount = g.Count(a => a.Status == AppointmentStatus.Completed);
                return new TopDoctorDto(
                    doctor.User!.FullName,
                    doctor.Specialization,
                    g.Count(),
                    completedCount * doctor.ConsultationFee
                );
            })
            .OrderByDescending(d => d.AppointmentCount)
            .Take(10)
            .ToList();

        return Ok(data);
    }

    [HttpGet("daily-trend")]
    public async Task<ActionResult<List<DailyAppointmentCountDto>>> GetDailyTrend()
    {
        var since = DateTime.UtcNow.AddDays(-14);

        var data = await _db.Appointments
            .Where(a => a.CreatedAt >= since)
            .GroupBy(a => a.CreatedAt.Date)
            .Select(g => new { Date = g.Key, Count = g.Count() })
            .OrderBy(g => g.Date)
            .ToListAsync();

        var result = data.Select(d => new DailyAppointmentCountDto(DateOnly.FromDateTime(d.Date), d.Count)).ToList();

        return Ok(result);
    }

    [HttpGet("by-specialization")]
    public async Task<ActionResult<List<SpecializationBreakdownDto>>> GetBySpecialization()
    {
        var doctorCounts = await _db.DoctorProfiles
            .GroupBy(d => d.Specialization)
            .Select(g => new { Specialization = g.Key, Count = g.Count() })
            .ToListAsync();

        var appointmentCounts = await _db.Appointments
            .Include(a => a.TimeSlot)!.ThenInclude(t => t!.DoctorProfile)
            .Where(a => a.TimeSlot != null && a.TimeSlot.DoctorProfile != null)
            .GroupBy(a => a.TimeSlot!.DoctorProfile!.Specialization)
            .Select(g => new { Specialization = g.Key, Count = g.Count() })
            .ToListAsync();

        var result = doctorCounts.Select(dc => new SpecializationBreakdownDto(
            dc.Specialization,
            dc.Count,
            appointmentCounts.FirstOrDefault(ac => ac.Specialization == dc.Specialization)?.Count ?? 0
        )).ToList();

        return Ok(result);
    }
}
