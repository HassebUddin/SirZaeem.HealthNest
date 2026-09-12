using HealthNest.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace HealthNest.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<DoctorProfile> DoctorProfiles => Set<DoctorProfile>();
    public DbSet<TimeSlot> TimeSlots => Set<TimeSlot>();
    public DbSet<Appointment> Appointments => Set<Appointment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasOne(u => u.DoctorProfile)
            .WithOne(d => d.User)
            .HasForeignKey<DoctorProfile>(d => d.UserId);

        modelBuilder.Entity<DoctorProfile>()
            .HasMany(d => d.TimeSlots)
            .WithOne(t => t.DoctorProfile)
            .HasForeignKey(t => t.DoctorProfileId);

        modelBuilder.Entity<TimeSlot>()
            .HasOne(t => t.Appointment)
            .WithOne(a => a.TimeSlot)
            .HasForeignKey<Appointment>(a => a.TimeSlotId);

        modelBuilder.Entity<Appointment>()
            .HasOne(a => a.Patient)
            .WithMany()
            .HasForeignKey(a => a.PatientId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<DoctorProfile>()
            .Property(d => d.ConsultationFee)
            .HasColumnType("decimal(10,2)");
    }
}
