namespace Core.Dto.Adventure
{
    public class AdventureDto
    {
        public Guid Id { get; set; }
        public string Category { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Duration {  get; set; } = string.Empty;
        public int MinAge { get; set; }
        public string Difficulty {  get; set; } = string.Empty;
        public string MainImageUrl { get; set; } = string.Empty;
    }
}
