namespace HealthNest.Api.DTOs;

public record SymptomCheckRequest(string Symptoms);

public record SymptomCheckResponse(string RecommendedSpecialization, string Explanation, List<DoctorSummaryDto> MatchingDoctors);
