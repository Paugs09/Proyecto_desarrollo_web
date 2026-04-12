using Postgrest.Models;

namespace Core.Entities
{
    public class UserProfile : BaseModel
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string? LastName { get; set; }
        public string Email { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string? ShippingAddress { get; set; }
        public DateTime CreatedDate { get; set; }
        public long RoleId { get; set; }

        public Role Role { get; set; } = null!;
    }
}
