using HealthNest.Api.Models;

namespace HealthNest.Api.DTOs;

public record RegisterRequest(string FullName, string Email, string Password, UserRole Role);

public record LoginRequest(string Email, string Password);

public record AuthResponse(string Token, int UserId, string FullName, string Role);
