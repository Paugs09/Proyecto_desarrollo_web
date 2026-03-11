using Core.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/common")]
    [ApiController]
    public class CommonController(ICommonService commonService) : ControllerBase
    {
        private readonly ICommonService _commonService = commonService;

    }
}
