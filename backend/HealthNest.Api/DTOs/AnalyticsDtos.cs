namespace HealthNest.Api.DTOs;

public record AnalyticsSummaryDto(
    int TotalAppointments,
    int TotalDoctors,
    int TotalPatients,
    decimal TotalRevenue,
    int PendingAppointments,
    int ConfirmedAppointments,
    int CancelledAppointments,
    int CompletedAppointments
);

public record TopDoctorDto(string DoctorName, string Specialization, int AppointmentCount, decimal Revenue);

public record DailyAppointmentCountDto(DateOnly Date, int Count);

public record SpecializationBreakdownDto(string Specialization, int DoctorCount, int AppointmentCount);
