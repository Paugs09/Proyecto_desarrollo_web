namespace Core.Dto.Product.ProductVariant
{
    public class DetailProductVariantDto
    {
        public long Id { get; set; }
        public string Sku { get; set; } = string.Empty;
        public decimal SpecificPrice { get; set; }
        public int Stock { get; set; }
        public List<DetailValueDto> Values { get; set; } = [];
    }
}
