using Core.Dto.Adventure;
using Core.Entities;

namespace Core.Services.Interfaces
{
    public interface IAdventureService
    {
        Task<Adventure?> GetAdventureByIdAsync(Guid id);
        Task<IEnumerable<AdventureDto>> GetAllAdventuresAsync();
        Task CreateAdventure(CreateAdventureDto dto);
        Task UpdateAdventure(Guid id, CreateAdventureDto dto);
        Task CreateAdventureImage(Guid adventureId, CreateAdventureImageDto imageDto);
    }
}
