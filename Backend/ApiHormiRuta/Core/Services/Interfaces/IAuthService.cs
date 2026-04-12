namespace Core.Services.Interfaces
{
    public interface IAuthService
    {
        Task<string> RegisterAsync(string email, string password, string firstName, string lastName);
        Task<string> LoginAsync(string email, string password);
    }
}
