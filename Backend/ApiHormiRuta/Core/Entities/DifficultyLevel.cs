namespace Core.Entities
{
    public class DifficultyLevel
    {
        public int Id {  get; set; }
        public string Name { get; set; } = string.Empty;

        public virtual ICollection<Adventure> Adventures { get; set; } = []; 
    }
}
