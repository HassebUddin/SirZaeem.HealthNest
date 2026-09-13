using HealthNest.Api.Data;
using HealthNest.Api.DTOs;
using HealthNest.Api.Models;
using HealthNest.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HealthNest.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly JwtService _jwtService;

    public AuthController(AppDbContext db, JwtService jwtService)
    {
        _db = db;
        _jwtService = jwtService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        if (request.Role == UserRole.Admin)
            return BadRequest("Registration for Administrator role is not permitted.");

        if (await _db.Users.AnyAsync(u => u.Email == request.Email))
            return BadRequest("Email already registered.");

        var user = new User
        {
            FullName = request.FullName,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = request.Role
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        if (user.Role == UserRole.Doctor)
        {
            _db.DoctorProfiles.Add(new DoctorProfile
            {
                UserId = user.Id,
                Specialization = "General",
                ConsultationFee = 0,
                Bio = string.Empty
            });
            await _db.SaveChangesAsync();
        }

        var token = _jwtService.GenerateToken(user);
        return Ok(new AuthResponse(token, user.Id, user.FullName, user.Role.ToString()));
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return Unauthorized("Invalid email or password.");

        var token = _jwtService.GenerateToken(user);
        return Ok(new AuthResponse(token, user.Id, user.FullName, user.Role.ToString()));
    }
}
