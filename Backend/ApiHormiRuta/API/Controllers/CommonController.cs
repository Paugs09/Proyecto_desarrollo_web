using Core.Services.Interfaces;
using Infraestructure.Filters;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/common")]
    [ApiController]
    public class CommonController(ICommonService commonService) : ControllerBase
    {
        private readonly ICommonService _commonService = commonService;

        [HttpGet("category-presentation")]
        [AdminOnly]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _commonService.GetPresentationCategoryList());
        }
    }
}
