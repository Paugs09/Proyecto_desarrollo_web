namespace Core.Entities
{
    public class AdventureSlot
    {
        public Guid Id { get; set; }
        public Guid AdventureId { get; set; }
        public DateTime StartTime { get; set; }
        public int TotalCapacity { get; set; }
        public int AvailableCapacity { get; set; }
        public decimal PricePerPerson { get; set; }

        // Navegación
        public  virtual Adventure Adventure { get; set; } = null!;
        public virtual ICollection<BookingDetailAdventure> BookingDetailAdventures { get; set; } = [];
    }
}
