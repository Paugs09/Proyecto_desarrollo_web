namespace Core.Entities
{
    public class Attribute : GeneralInfo
    {
        public virtual ICollection<AttributeValue> AttributeValues { get; set; } = [];
    }
}
