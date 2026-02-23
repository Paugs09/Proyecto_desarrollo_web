namespace Core.Entities
{
    public class BookingDetailHotel
    {
        public Guid Id { get; set; }
        public Guid BookingId { get; set; }
        public Guid RoomTypeId { get; set; }
        public DateTime CheckIn { get; set; }
        public DateTime CheckOut { get; set; }
        public int? RoomCount { get; set; }

        // Navegación
        public Booking Booking { get; set; } = null!;
        public RoomType RoomType { get; set; } = null!;
    }
}
