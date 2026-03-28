namespace Core.Entities
{
    public class Product
    {
        public long Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string ShortDescription {  get; set; } = string.Empty;
        public string? LongDescription {  get; set; }
        public long CategoryId { get; set; }
        public long? MaterialId { get; set; }
        public long MunicipalityId { get; set; }
        public string Notes { get; set; } = string.Empty;
        public string Dimensions { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }

        public virtual Category Category { get; set; } = null!;
        public virtual Material? Material { get; set; }
        public virtual Municipality Municipality { get; set; } = null!;
        public virtual ICollection<ProductVariant> ProductVariants { get; set; } = [];
        public virtual ICollection<ProductImage> ProductImages { get; set; } = [];
    }
}
