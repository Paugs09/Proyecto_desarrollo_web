namespace Core.Entities
{
    public class BookingDetailAdventure
    {
        public Guid Id { get; set; }
        public Guid BookingId { get; set; }
        public Guid SlotId { get; set; }
        public int AdultCount { get; set; }
        public int? ChildCount { get; set; }

        // Navegación
        public Booking Booking { get; set; } = null!;
        public AdventureSlot AdventureSlot { get; set; } = null!;
    }
}
