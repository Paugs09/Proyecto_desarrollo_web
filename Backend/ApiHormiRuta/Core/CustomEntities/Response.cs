namespace Core.CustomEntities
{
    public class Response
    {
        public int Status { get; set; }
        public string Message { get; set; } = string.Empty;
        public object Description { get; set; } = string.Empty;
    }
}
