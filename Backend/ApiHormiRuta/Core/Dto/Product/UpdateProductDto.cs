namespace Core.Dto.Product
{
    public class UpdateProductDto : CreateProductDto
    {
        public List<string>? ImageUrlsToDelete { get; set; }
    }
}
