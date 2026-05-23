using Core.Dto.Product;
using Core.QueryFilter.Product;
using Core.Services.Interfaces;
using Infraestructure.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductController(IProductService productService) : ControllerBase
    {
        private readonly IProductService _productService = productService;

        [HttpGet()]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll([FromQuery] ProductQueryFilter queryFilter)
        {
            return Ok(await _productService.GetAllProductsAsync(queryFilter));
        }

        [HttpGet("detail/{id:long}")]
        [AllowAnonymous]
        public async Task<IActionResult> Detail(long id)
        {
            var userId = HttpContext.Items["UserId"]?.ToString();
            return Ok(await _productService.GetDetailProduct(id, userId != null ? Guid.Parse(userId) : null));
        }

        [HttpGet("best-sellers")]
        [AllowAnonymous]
        public async Task<IActionResult> BestSellers()
        {
            return Ok(await _productService.BestSellers());
        }

        [HttpGet("wish-list")]
        public async Task<IActionResult> GetAllProductOfWishList()
        {
            var userId = HttpContext.Items["UserId"]?.ToString();
            _ = Guid.TryParse(userId, out Guid parsedUserId);

            return Ok(await _productService.GetAllProductsOfWishList(parsedUserId));
        }

        [HttpPost("wish-list")]
        public async Task<IActionResult> AddWishList(CreateWishListDto wishListDto)
        {
            var userId = HttpContext.Items["UserId"]?.ToString();
            _ = Guid.TryParse(userId, out Guid parsedUserId);

            await _productService.AddProductToWishList(wishListDto, parsedUserId);
            return Ok();
        }

        [HttpGet("purchase-history")]
        public IActionResult GetPurchaseProducts()
        {
            var userId = HttpContext.Items["UserId"]?.ToString();
            _ = Guid.TryParse(userId, out Guid parsedUserId);

            return Ok(_productService.PurchaseHistory(parsedUserId));
        }

        [HttpPost()]
        [AdminOnly]
        public async Task<IActionResult> CreateProduct([FromBody] CreateProductDto dto)
        {
            await _productService.CreateProduct(dto);
            return Created();
        }

        [HttpPut("{productId}")]
        [AdminOnly]
        public async Task<IActionResult> UpdateProduct(long productId, [FromBody] UpdateProductDto dto)
        {
            await _productService.UpdateProduct(productId, dto);
            return new ObjectResult(new { StatusCode = StatusCodes.Status204NoContent, Value = "Producto actualizado" });
        }

        [HttpDelete("{id:long}")]
        [AdminOnly]
        public async Task<IActionResult> DeleteProduct(long id)
        {
            await _productService.DeleteProduct(id);
            return NoContent();
        }

        [HttpPost("upload-image")]
        [AdminOnly]
        public async Task<IActionResult> CreateProductImage([FromForm] IFormFile formFile)
        {
            var imagePath = await _productService.CreateProductImage(formFile);
            return Ok(imagePath);
        }
    }
}
