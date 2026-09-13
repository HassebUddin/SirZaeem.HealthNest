using Microsoft.AspNetCore.SignalR;

namespace HealthNest.Api.Hubs;

public class AppointmentHub : Hub
{
    public async Task JoinDoctorGroup(string doctorProfileId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"doctor-{doctorProfileId}");
        await Groups.AddToGroupAsync(Context.ConnectionId, $"doctor-user-{doctorProfileId}");
    }

    public async Task JoinDoctorUserGroup(string userId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"doctor-user-{userId}");
    }

    public async Task JoinPatientGroup(string userId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"patient-{userId}");
    }

    public async Task JoinQueueGroup(string doctorProfileId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"queue-{doctorProfileId}");
    }
}
