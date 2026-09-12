namespace HealthNest.Api.DTOs;

public record QueueEntryDto(int AppointmentId, string PatientName, int Position, DateTime CheckedInAt, bool IsCurrent);

public record QueueStatusDto(int AppointmentId, int Position, int PeopleAhead, int EstimatedWaitMinutes);
