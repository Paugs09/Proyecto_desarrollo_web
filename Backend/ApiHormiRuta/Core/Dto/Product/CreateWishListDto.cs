namespace Core.Dto.Product
{
    public class CreateWishListDto
    {
        public long ProductVariantId { get; set; }
        public bool IsFavorite { get; set; }
    }
}
