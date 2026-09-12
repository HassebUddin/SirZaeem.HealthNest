namespace HealthNest.Api.DTOs;

public record DoctorProfileRequest(string Specialization, decimal ConsultationFee, string Bio);

public record TimeSlotRequest(DateTime StartTime, DateTime EndTime);

public record DoctorSummaryDto(int DoctorProfileId, string FullName, string Specialization, decimal ConsultationFee, string Plan);

public record TimeSlotDto(int Id, DateTime StartTime, DateTime EndTime, bool IsBooked);

public record BookAppointmentRequest(int TimeSlotId);

public record AppointmentDto(int Id, string DoctorName, string PatientName, DateTime StartTime, DateTime EndTime, string Status);
