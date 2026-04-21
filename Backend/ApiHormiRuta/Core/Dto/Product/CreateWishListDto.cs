namespace Core.Dto.Product
{
    public class CreateWishListDto
    {
        public long ProductId { get; set; }
        public bool IsFavorite { get; set; }
    }
}
