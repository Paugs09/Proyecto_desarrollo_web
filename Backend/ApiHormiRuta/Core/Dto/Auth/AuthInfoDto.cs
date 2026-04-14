namespace Core.Dto.Auth
{
    public class AuthInfoDto
    {
        public string AccessToken { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
        public bool IsAdmin { get; set; }
    }
}
