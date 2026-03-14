using Core.Dto.Adventure;
using Core.Entities;

namespace Core.Services.Interfaces
{
    public interface IAdventureService
    {
        Task<IEnumerable<Adventure>> GetAllAdventuresAsync();
        Task CreateAdventure(CreateAdventureDto dto);
        Task CreateAdventureImage(Guid adventureId, CreateAdventureImageDto imageDto);
    }
}
