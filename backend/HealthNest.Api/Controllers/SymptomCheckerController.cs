using HealthNest.Api.Data;
using HealthNest.Api.DTOs;
using HealthNest.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HealthNest.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SymptomCheckerController : ControllerBase
{
    private readonly GeminiService _gemini;
    private readonly AppDbContext _db;

    public SymptomCheckerController(GeminiService gemini, AppDbContext db)
    {
        _gemini = gemini;
        _db = db;
    }

    [HttpPost("analyze")]
    public async Task<ActionResult<SymptomCheckResponse>> Analyze(SymptomCheckRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Symptoms))
            return BadRequest("Please describe your symptoms.");

        var (specialization, explanation) = await _gemini.AnalyzeSymptomsAsync(request.Symptoms);

        var matchingDoctors = await _db.DoctorProfiles
            .Include(d => d.User)
            .Where(d => d.Specialization == specialization)
            .Select(d => new DoctorSummaryDto(d.Id, d.User!.FullName, d.Specialization, d.ConsultationFee, d.Plan.ToString()))
            .ToListAsync();

        return Ok(new SymptomCheckResponse(specialization, explanation, matchingDoctors));
    }
}
