namespace Core.Entities
{
    public class Municipality : GeneralInfo
    {
        public virtual ICollection<Product> Products { get; set; } = [];
    }
}
