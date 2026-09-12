namespace HealthNest.Api.Models;

public class TimeSlot
{
    public int Id { get; set; }
    public int DoctorProfileId { get; set; }
    public DoctorProfile? DoctorProfile { get; set; }

    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public bool IsBooked { get; set; }

    public Appointment? Appointment { get; set; }
}
