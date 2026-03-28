namespace Core.Dto.Product.ProductImage
{
    public class DetailProductImageDto
    {
        public long Id { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public bool IsPrimary { get; set; }
        public int DisplayOrder { get; set; }
    }
}
