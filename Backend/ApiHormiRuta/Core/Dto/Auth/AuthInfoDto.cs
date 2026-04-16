namespace Core.Dto.Auth
{
    public class AuthInfoDto
    {
        public string AccessToken { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
        public long ExpiresIn { get; set; }
        public bool IsAdmin { get; set; }
    }
}
