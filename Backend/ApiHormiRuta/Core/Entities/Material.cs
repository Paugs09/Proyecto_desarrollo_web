namespace Core.Entities
{
    public class Material : GeneralInfo
    {
        public virtual ICollection<Product> Products { get; set; } = [];
    }
}
