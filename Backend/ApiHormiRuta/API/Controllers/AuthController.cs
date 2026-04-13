using Core.Dto.Auth;
using Core.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace API.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController(IAuthService authService) : ControllerBase
    {
        private readonly IAuthService _authService = authService;

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] UserRegister request)
        {
            try
            {
                var token = await _authService.RegisterAsync(request);
                return Ok(new { Token = token });
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var token = await _authService.LoginAsync(request.Email, request.Password);
                return Ok(new { Token = token });
            }
            catch (Exception ex) { return Unauthorized(ex.Message); }
        }
    }

    public record LoginRequest(string Email, string Password);
}
