namespace Core.Entities
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;

        public ICollection<Adventure> Adventures { get; set; } = [];
    }
}
