namespace Core.Entities
{
    public class Adventure
    {
        public Guid Id { get; set; }
        public int CategoryId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Duration { get; set; } = string.Empty;
        public int MinAge { get; set; }
        public string? PhysicalRequirements { get; set; }
        public int DifficultyId { get; set; }

        public virtual Category Category { get; set; } = null!;
        public virtual DifficultyLevel DifficultyLevel { get; set; } = null!;
        public virtual ICollection<AdventureSlot> AdventureSlots { get; set; } = [];
        public virtual ICollection<AdventureImage> Images { get; set; } = [];
    }
}
