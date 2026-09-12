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
public class AdminController : ControllerBase
{
    private readonly AppDbContext _db;

    public AdminController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("doctors")]
    public async Task<ActionResult<List<AdminDoctorDto>>> GetDoctors()
    {
        var doctors = await _db.DoctorProfiles
            .Include(d => d.User)
            .Include(d => d.TimeSlots)!.ThenInclude(t => t.Appointment)
            .Select(d => new AdminDoctorDto(
                d.Id,
                d.User!.FullName,
                d.User.Email,
                d.Specialization,
                d.ConsultationFee,
                d.Plan.ToString(),
                d.TimeSlots.Count(t => t.Appointment != null),
                d.User.CreatedAt
            ))
            .ToListAsync();

        return Ok(doctors.OrderByDescending(d => d.TotalAppointments).ToList());
    }

    [HttpGet("patients")]
    public async Task<ActionResult<List<AdminPatientDto>>> GetPatients()
    {
        var patients = await _db.Users
            .Where(u => u.Role == UserRole.Patient)
            .Select(u => new AdminPatientDto(
                u.Id,
                u.FullName,
                u.Email,
                _db.Appointments.Count(a => a.PatientId == u.Id),
                u.CreatedAt
            ))
            .ToListAsync();

        return Ok(patients.OrderByDescending(p => p.TotalAppointments).ToList());
    }

    [HttpGet("appointments")]
    public async Task<ActionResult<List<AdminAppointmentDto>>> GetAppointments([FromQuery] string? status)
    {
        var query = _db.Appointments
            .Include(a => a.Patient)
            .Include(a => a.TimeSlot)!.ThenInclude(t => t!.DoctorProfile)!.ThenInclude(d => d!.User)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<AppointmentStatus>(status, true, out var parsedStatus))
            query = query.Where(a => a.Status == parsedStatus);

        var appointments = await query
            .OrderByDescending(a => a.TimeSlot!.StartTime)
            .Select(a => new AdminAppointmentDto(
                a.Id,
                a.TimeSlot!.DoctorProfile!.User!.FullName,
                a.TimeSlot.DoctorProfile.Specialization,
                a.Patient!.FullName,
                a.TimeSlot.StartTime,
                a.TimeSlot.EndTime,
                a.Status.ToString(),
                a.CheckedIn
            ))
            .ToListAsync();

        return Ok(appointments);
    }
}
