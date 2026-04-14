using Core.Dto.Auth;
using Core.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Supabase.Gotrue.Exceptions;

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
            catch (GotrueException ex) { return BadRequest(ex.Message); }
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var info = await _authService.LoginAsync(request.Email, request.Password);
                return Ok(info);
            }
            catch (GotrueException ex) { return Unauthorized(ex.Message); }
        }

        [HttpPost("refresh")]
        [AllowAnonymous]
        public async Task<IActionResult> Refresh([FromBody] RefreshRequest request)
        {
            try
            {
                var result = await _authService.RefreshTokenAsync(request.AccessToken, request.RefreshToken);
                return Ok(result);
            }
            catch (GotrueException ex)
            {
                return Unauthorized(ex.Message);
            }
        }

        public class RefreshRequest
        {
            public string AccessToken { get; set; } = string.Empty;
            public string RefreshToken { get; set; } = string.Empty;
        }
    }

    public record LoginRequest(string Email, string Password);
}
