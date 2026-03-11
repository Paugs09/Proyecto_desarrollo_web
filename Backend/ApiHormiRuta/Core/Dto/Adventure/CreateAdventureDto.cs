namespace Core.Dto.Adventure
{
    public class CreateAdventureDto
    {
        public int CategoryId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int DifficultyId { get; set; }
        public string Duration { get; set; } = string.Empty;
        public int MinAge { get; set; }
        public string? PhysicalRequirements { get; set; }
    }
}
