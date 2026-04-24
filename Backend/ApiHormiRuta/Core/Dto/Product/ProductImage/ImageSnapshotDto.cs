using System.Text.Json.Serialization;

namespace Core.Dto.Product.ProductImage
{
    public class ImageSnapshotDto
    {
        [JsonPropertyName("url")]
        public string Url { get; set; } = string.Empty;

        [JsonPropertyName("is_primary")]
        public bool IsPrimary { get; set; }

        [JsonPropertyName("display_order")]
        public int DisplayOrder {  get; set; }
    }
}
