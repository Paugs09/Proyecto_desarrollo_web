using Core.Dto.Cart.CartItem;
using Core.Dto.Cart.Order;
using Core.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/cart")]
    [ApiController]
    public class CartController(ICartService cartService) : ControllerBase
    {
        private readonly ICartService _cartService = cartService;

        [HttpPost("items")]
        public async Task<IActionResult> ManageProductsOfCart(List<CreateCartItemDto> items)
        {
            var userId = HttpContext.Items["UserId"]?.ToString();
            _ = Guid.TryParse(userId, out Guid parsedUserId);

            await _cartService.ManageProductsOfCart(items, parsedUserId);
            return Created();
        }

        [HttpPost("create-order")]
        public async Task<IActionResult> CreateOrder(List<CreateOrderItemDto> createOrderItemDto)
        {
            var userId = HttpContext.Items["UserId"]?.ToString();
            _ = Guid.TryParse(userId, out Guid parsedUserId);

            return Created((string?)null, await _cartService.CreateOrder(createOrderItemDto, parsedUserId));
        }

        [HttpPut("finish-order/{id}")]
        public async Task<IActionResult> FinishOrder(long id)
        {
            var userId = HttpContext.Items["UserId"]?.ToString();
            _ = Guid.TryParse(userId, out Guid parsedUserId);

            await _cartService.FinishOrder(parsedUserId, id);
            return Ok();
        }

        [HttpGet("items")]
        public async Task<IActionResult> ListCartItems()
        {
            var userId = HttpContext.Items["UserId"]?.ToString();
            _ = Guid.TryParse(userId, out Guid parsedUserId);

            var orderDto = _cartService.GetCartItemInfo(parsedUserId);
            return Ok(orderDto);
        }
    }
}
