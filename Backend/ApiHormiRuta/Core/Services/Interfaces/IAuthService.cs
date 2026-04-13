using Core.Dto.Auth;

namespace Core.Services.Interfaces
{
    public interface IAuthService
    {
        Task<string> RegisterAsync(UserRegister userRegister);
        Task<string> LoginAsync(string email, string password);
    }
}
