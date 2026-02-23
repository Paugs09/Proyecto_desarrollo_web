namespace Core.Entities
{
    public class RoomType
    {
        public Guid Id { get; set; }
        public Guid HotelId { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Capacity { get; set; }
        public decimal PricePerNight { get; set; }
        public int TotalStock { get; set; }

        // Navegación
        public Hotel Hotel { get; set; } = null!;
        public virtual ICollection<BookingDetailHotel> BookingDetailHotels { get; set; } = [];
    }
}
