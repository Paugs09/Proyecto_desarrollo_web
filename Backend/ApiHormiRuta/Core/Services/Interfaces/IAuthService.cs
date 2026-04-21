using Core.Dto.Auth;

namespace Core.Services.Interfaces
{
    public interface IAuthService
    {
        Task<string> RegisterAsync(UserRegister userRegister);
        Task<AuthInfoDto> RefreshTokenAsync(string accessToken, string refreshToken);
        Task<AuthInfoDto> LoginAsync(string email, string password);
        Task<UserInfoDto> GetUserInfo(Guid userId);
    }
}
