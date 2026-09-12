namespace HealthNest.Api.Models;

public enum SubscriptionPlan
{
    Free,
    Premium
}

public class DoctorProfile
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User? User { get; set; }

    public string Specialization { get; set; } = string.Empty;
    public decimal ConsultationFee { get; set; }
    public string Bio { get; set; } = string.Empty;

    public SubscriptionPlan Plan { get; set; } = SubscriptionPlan.Free;

    public ICollection<TimeSlot> TimeSlots { get; set; } = new List<TimeSlot>();
}
