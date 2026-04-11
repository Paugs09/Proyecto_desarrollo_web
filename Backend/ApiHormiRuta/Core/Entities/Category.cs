namespace Core.Entities
{
    public class Category : GeneralInfo
    {
        public string Description { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }

        public virtual ICollection<Product> Products { get; set; } = [];
    }
}
