namespace Core.Dto.Auth
{
    public class UserInfoDto
    {
        public Guid UserId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string? LastName { get; set; }
        public string Email { get; set; } = string.Empty;
        public string? Phone {  get; set; }
        public string? ShippingAddress { get; set; }
        public string Role { get; set; } = string.Empty;
        public long RoleId { get; set; }
        public string? Avatar {  get; set; }
    }
}
