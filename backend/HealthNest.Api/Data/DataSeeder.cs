using HealthNest.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace HealthNest.Api.Data;

public static class DataSeeder
{
    private static readonly (string Name, string Specialization, decimal Fee, SubscriptionPlan Plan, string Bio)[] Doctors =
    [
        ("Ahmed Khan", "Cardiologist", 4000m, SubscriptionPlan.Premium, "Senior cardiologist with 15 years of experience in interventional cardiology."),
        ("Sana Malik", "Dermatologist", 3000m, SubscriptionPlan.Free, "Specialist in skin conditions, acne treatment, and cosmetic dermatology."),
        ("Fatima Zahra", "Neurologist", 5000m, SubscriptionPlan.Premium, "Expert in treating migraines, epilepsy, and neurological disorders."),
        ("Ayesha Raza", "Pediatrician", 2500m, SubscriptionPlan.Free, "Caring pediatrician dedicated to child health and development."),
        ("Usman Tariq", "Orthopedic", 3500m, SubscriptionPlan.Free, "Orthopedic surgeon specializing in sports injuries and joint replacement."),
        ("Hina Farooq", "Gynecologist", 3500m, SubscriptionPlan.Premium, "Women's health specialist with focus on prenatal and reproductive care."),
        ("Kamran Sheikh", "ENT Specialist", 2500m, SubscriptionPlan.Free, "Ear, nose and throat specialist treating sinus and hearing issues."),
        ("Zara Nadeem", "Psychiatrist", 4500m, SubscriptionPlan.Premium, "Mental health professional specializing in anxiety and depression."),
        ("Fahad Iqbal", "Gastroenterologist", 3800m, SubscriptionPlan.Free, "Digestive health expert treating stomach and intestinal disorders."),
        ("Mahnoor Siddiqui", "Ophthalmologist", 3000m, SubscriptionPlan.Free, "Eye care specialist offering vision correction and eye disease treatment."),
        ("Danish Malik", "Dentist", 2000m, SubscriptionPlan.Premium, "General and cosmetic dentistry with a gentle, modern approach."),
        ("Rabia Chaudhry", "General Physician", 1500m, SubscriptionPlan.Free, "Family medicine doctor providing comprehensive primary care.")
    ];

    private static readonly string[] PatientNames =
    [
        "Ali Hassan", "Fatima Sheikh", "Omar Farooqi", "Maria Yousaf", "Hassan Raza",
        "Amna Khalid", "Bilawal Chaudhry", "Sadia Nawaz", "Talha Mirza", "Iqra Batool",
        "Noman Aslam", "Sara Ahmed", "Waqas Anwar", "Mehak Ilyas", "Adeel Qureshi",
        "Zoya Imran", "Shahzad Butt", "Nadia Riaz"
    ];

    public static async Task SeedAsync(AppDbContext db)
    {
        await RepairSlotConsistencyAsync(db);

        if (await db.DoctorProfiles.CountAsync() >= Doctors.Length)
            return;

        var random = new Random(42);

        if (!await db.Users.AnyAsync(u => u.Role == UserRole.Admin))
        {
            db.Users.Add(new User
            {
                FullName = "Platform Admin",
                Email = "admin@healthnest.app",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                Role = UserRole.Admin
            });
        }

        var doctorProfiles = new List<DoctorProfile>();

        foreach (var (name, specialization, fee, plan, bio) in Doctors)
        {
            var email = $"{name.ToLower().Replace(" ", ".")}@healthnest.app";
            if (await db.Users.AnyAsync(u => u.Email == email))
                continue;

            var user = new User
            {
                FullName = $"Dr. {name}",
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Doctor@123"),
                Role = UserRole.Doctor
            };

            var profile = new DoctorProfile
            {
                User = user,
                Specialization = specialization,
                ConsultationFee = fee,
                Plan = plan,
                Bio = bio
            };

            db.Users.Add(user);
            db.DoctorProfiles.Add(profile);
            doctorProfiles.Add(profile);
        }

        var patientUsers = new List<User>();

        foreach (var name in PatientNames)
        {
            var email = $"{name.ToLower().Replace(" ", ".")}@example.com";
            if (await db.Users.AnyAsync(u => u.Email == email))
                continue;

            var user = new User
            {
                FullName = name,
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Patient@123"),
                Role = UserRole.Patient
            };

            db.Users.Add(user);
            patientUsers.Add(user);
        }

        await db.SaveChangesAsync();

        var now = DateTime.UtcNow;
        var statuses = new[] { AppointmentStatus.Pending, AppointmentStatus.Confirmed, AppointmentStatus.Completed, AppointmentStatus.Cancelled };

        foreach (var profile in doctorProfiles)
        {
            var slotCount = random.Next(6, 10);

            for (var i = 0; i < slotCount; i++)
            {
                var dayOffset = random.Next(-10, 15);
                var hour = random.Next(9, 17);
                var start = now.Date.AddDays(dayOffset).AddHours(hour);

                var slot = new TimeSlot
                {
                    DoctorProfile = profile,
                    StartTime = start,
                    EndTime = start.AddMinutes(30)
                };

                db.TimeSlots.Add(slot);

                var shouldBook = random.NextDouble() < 0.75;
                if (shouldBook && patientUsers.Count > 0)
                {
                    slot.IsBooked = true;
                    var patient = patientUsers[random.Next(patientUsers.Count)];

                    var status = dayOffset < 0
                        ? (random.NextDouble() < 0.8 ? AppointmentStatus.Completed : AppointmentStatus.Cancelled)
                        : statuses[random.Next(statuses.Length)];

                    var appointment = new Appointment
                    {
                        Patient = patient,
                        TimeSlot = slot,
                        Status = status,
                        CreatedAt = start.AddDays(-random.Next(1, 5))
                    };

                    if (status == AppointmentStatus.Confirmed && dayOffset >= 0 && random.NextDouble() < 0.3)
                    {
                        appointment.CheckedIn = true;
                        appointment.CheckedInAt = now.AddMinutes(-random.Next(5, 40));
                    }

                    db.Appointments.Add(appointment);
                }
            }
        }

        await db.SaveChangesAsync();
    }

    private static async Task RepairSlotConsistencyAsync(AppDbContext db)
    {
        var bookedSlotIds = await db.Appointments.Select(a => a.TimeSlotId).ToListAsync();

        var inconsistentSlots = await db.TimeSlots
            .Where(t => !t.IsBooked && bookedSlotIds.Contains(t.Id))
            .ToListAsync();

        if (inconsistentSlots.Count == 0)
            return;

        foreach (var slot in inconsistentSlots)
            slot.IsBooked = true;

        await db.SaveChangesAsync();
    }
}
