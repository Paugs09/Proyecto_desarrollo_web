using Core.Dto.Product.ProductImage;
using System.Text.Json.Serialization;

namespace Core.Dto.Product.ProductVariant
{
    public class ProductVariantSnapshotDto
    {
        [JsonPropertyName("variant_id")]
        public int VariantId { get; set; }

        [JsonPropertyName("sku")]
        public string Sku { get; set; } = string.Empty;

        [JsonPropertyName("attributes")]
        public required object Attributes { get; set; }

        [JsonPropertyName("price_at_purchase")]
        public decimal PriceAtPurchase { get; set; }

        [JsonPropertyName("current_list_price")]
        public decimal CurrentListPrice { get; set; }

        [JsonPropertyName("quantify_purchased")]
        public int QuantifyPurchased { get; set; }

        [JsonPropertyName("total_value")]
        public decimal TotalValue { get; set; }

        [JsonPropertyName("stock_before_purchase")]
        public int StockBeforePurchase { get; set; }

        [JsonPropertyName("images")]
        public List<ImageSnapshotDto> Images { get; set; } = [];
    }
}
