using Core.Dto.Product.ProductImage;
using System.Text.Json.Serialization;

namespace Core.Dto.Product
{
    public class ProductSnapshotDto
    {
        [JsonPropertyName("product_id")]
        public long ProductId { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("short_description")]
        public string? ShortDescription { get; set; }

        [JsonPropertyName("long_description")]
        public string? LongDescription { get; set; }

        [JsonPropertyName("category_id")]
        public int CategoryId { get; set; }

        [JsonPropertyName("category")]
        public string Category { get; set; }

        [JsonPropertyName("municipality_id")]
        public int MunicipalityId { get; set; }

        [JsonPropertyName("municipality")]
        public string Municipality { get; set; }

        [JsonPropertyName("notes")]
        public string? Notes { get; set; }

        [JsonPropertyName("material")]
        public string? Material { get; set; }

        [JsonPropertyName("material_id")]
        public int? MaterialId { get; set; }

        [JsonPropertyName("dimensions")]
        public string? Dimensions { get; set; }
    }
}
