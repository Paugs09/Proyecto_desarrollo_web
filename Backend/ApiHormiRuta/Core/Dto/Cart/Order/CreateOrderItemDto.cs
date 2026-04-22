namespace Core.Dto.Cart.Order
{
    public class CreateOrderItemDto
    {
        public long ProductVariantId { get; set; }
        public int Quantify { get; set; }
    }
}
