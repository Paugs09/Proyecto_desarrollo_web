using Postgrest.Models;

namespace Core.Entities
{
    public class Role : BaseModel
    {
        public long Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }

        public virtual ICollection<UserProfile> UserProfiles { get; set; } = [];
    }
}
