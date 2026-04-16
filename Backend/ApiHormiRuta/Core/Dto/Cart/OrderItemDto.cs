namespace Core.Dto.Cart
{
    public class OrderItemDto
    {
        public string ProductName { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public int Quantify { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalAmountPerUnit { get; set; }
    }
}
