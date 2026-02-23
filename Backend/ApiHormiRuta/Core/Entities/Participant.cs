namespace Core.Entities
{
    public class Participant
    {
        public Guid Id { get; set; }
        public Guid BookingId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string? MiddleName { get; set; }
        public string LastName { get; set; } = string.Empty;
        public string? IdNumber { get; set; }
        public string? MedicalData { get; set; }
        public bool WaiverSigned { get; set; }
    }
}
