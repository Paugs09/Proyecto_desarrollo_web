using System.Text.Json.Serialization;

namespace Core.Dto.Cart.Order
{
    public class InfoOrderCreatedDto
    {
        [JsonPropertyName("order_id")]
        public long OrderId { get; set; }

        [JsonPropertyName("total_amount")]
        public decimal TotalAmount { get; set; }
    }
}
