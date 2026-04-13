namespace Core.Dto.Product.ProductImage
{
    public class CreateProductImageDto
    {
        public long ProductId { get; set; }
        public long VariantId { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public bool IsPrimary { get; set; }
        public int DisplayOrder { get; set; }
    }
}
