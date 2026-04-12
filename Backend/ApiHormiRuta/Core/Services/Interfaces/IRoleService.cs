namespace Core.Services.Interfaces
{
    public interface IRoleService
    {
        Task<bool> IsAdmin(Guid userId);
    }
}
