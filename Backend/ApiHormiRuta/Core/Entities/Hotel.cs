namespace Core.Entities
{
    public class Hotel
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Stars { get; set; }
        public TimeSpan CheckInTime { get; set; }
        public TimeSpan CheckOutTime { get; set; }
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;

        // Navegación
        public Provider Provider { get; set; } = null!;
        public ICollection<RoomType> RoomTypes { get; set; } = [];
    }
}
