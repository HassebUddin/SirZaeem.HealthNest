namespace HealthNest.Api.Models;

public enum AppointmentStatus
{
    Pending,
    Confirmed,
    Cancelled,
    Completed
}

public class Appointment
{
    public int Id { get; set; }

    public int PatientId { get; set; }
    public User? Patient { get; set; }

    public int TimeSlotId { get; set; }
    public TimeSlot? TimeSlot { get; set; }

    public AppointmentStatus Status { get; set; } = AppointmentStatus.Pending;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public bool CheckedIn { get; set; }
    public DateTime? CheckedInAt { get; set; }
}
