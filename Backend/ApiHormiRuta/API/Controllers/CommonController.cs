using Core.Services.Interfaces;
using Infraestructure.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/common")]
    [ApiController]
    public class CommonController(ICommonService commonService) : ControllerBase
    {
        private readonly ICommonService _commonService = commonService;

        [HttpGet("category-presentation")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _commonService.GetPresentationCategoryList());
        }

        [HttpGet("parameter/{item}")]
        [AdminOnly]
        public async Task<IActionResult> GetAll(string item)
        {
            return Ok(await _commonService.Common(item));
        }
    }
}
