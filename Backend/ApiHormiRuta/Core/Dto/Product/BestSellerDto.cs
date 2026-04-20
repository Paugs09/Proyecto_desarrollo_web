namespace Core.Dto.Product
{
    public class BestSellerDto
    {
        public long ProductVariantId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public long TotalSales { get; set; }
    }
}
