namespace Core.Entities
{
    public class Provider
    {
        public Guid Id { get; set; }
        public Guid ProfileId { get; set; }
        public string BusinessName { get; set; } = string.Empty;
        public string? LicenseNumber { get; set; }
        public string? Description { get; set; }
        public string? GpsLocation { get; set; }
        public bool IsVerified { get; set; }
    }
}
