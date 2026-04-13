namespace Core.Dto.Attribute.AttributeValue
{
    public class CreateAttributeValueDto
    {
        public long AttributeId { get; set; }
        public string Value { get; set; } = string.Empty;
    }
}
