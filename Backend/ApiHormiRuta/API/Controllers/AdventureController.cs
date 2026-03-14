using Core.Dto.Adventure;
using Core.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/adventures")]
    [ApiController]
    public class AdventureController(IAdventureService adventureService) : ControllerBase
    {
        private readonly IAdventureService _adventureService = adventureService;

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _adventureService.GetAllAdventuresAsync());
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateAdventureDto dto)
        {
            await _adventureService.CreateAdventure(dto);
            return Ok();
        }

        [HttpPut("{adventureId:Guid}/images")]
        public async Task<IActionResult> Create(Guid adventureId, [FromForm] CreateAdventureImageDto imageDto)
        {
            await _adventureService.CreateAdventureImage(adventureId, imageDto);
            return Ok();
        }
    }
}
