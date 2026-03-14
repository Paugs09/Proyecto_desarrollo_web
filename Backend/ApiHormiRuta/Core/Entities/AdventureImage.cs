namespace Core.Entities
{
    public class AdventureImage : Image
    {
        public Guid AdventureId { get; set; }

        public virtual Adventure Adventure { get; set; } = null!;
    }
}
