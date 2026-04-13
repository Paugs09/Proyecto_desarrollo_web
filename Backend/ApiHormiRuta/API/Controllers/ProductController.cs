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

        [HttpPost()]
        [AdminOnly]
        public async Task<IActionResult> CreateProduct([FromBody] CreateProductDto dto)
        {
            await _productService.CreateProduct(dto);
            return Created();
        }
    }
}
