namespace HealthNest.Api.DTOs;

public record AdminDoctorDto(
    int DoctorProfileId,
    string FullName,
    string Email,
    string Specialization,
    decimal ConsultationFee,
    string Plan,
    int TotalAppointments,
    DateTime JoinedAt
);

public record AdminPatientDto(
    int UserId,
    string FullName,
    string Email,
    int TotalAppointments,
    DateTime JoinedAt
);

public record AdminAppointmentDto(
    int Id,
    string DoctorName,
    string Specialization,
    string PatientName,
    DateTime StartTime,
    DateTime EndTime,
    string Status,
    bool CheckedIn
);
