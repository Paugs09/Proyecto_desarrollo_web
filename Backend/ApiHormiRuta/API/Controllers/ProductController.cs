using Core.Dto.Product;
using Core.QueryFilter.Product;
using Core.Services.Interfaces;
using Infraestructure.Filters;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/product")]
    [ApiController]
    public class ProductController(IProductService productService) : ControllerBase
    {
        private readonly IProductService _productService = productService;

        [HttpGet()]
        public async Task<IActionResult> GetAll([FromQuery] ProductQueryFilter queryFilter)
        {
            return Ok(await _productService.GetAllProductsAsync(queryFilter));
        }

        [HttpGet("detail/{id:long}")]
        public async Task<IActionResult> Detail(long id)
        {
            return Ok(await _productService.GetDetailProduct(id));
        }

        [HttpPost("wish-list")]
        public async Task<IActionResult> AddWishList(CreateWishListDto wishListDto)
        {
            var userId = HttpContext.Items["UserId"]?.ToString();
            _ = Guid.TryParse(userId, out Guid parsedUserId);

            await _productService.AddProductToWishList(wishListDto, parsedUserId);
            return Ok();
        }

        [HttpPost()]
        [AdminOnly]
        public async Task<IActionResult> CreateProduct([FromBody] CreateProductDto dto)
        {
            await _productService.CreateProduct(dto);
            return Created();
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
