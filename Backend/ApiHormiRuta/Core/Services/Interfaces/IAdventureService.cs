using Core.Dto.Adventure;

namespace Core.Services.Interfaces
{
    public interface IAdventureService
    {
        Task<IEnumerable<AdventureDto>> GetAllAdventuresAsync();
        Task CreateAdventure(CreateAdventureDto dto);
        Task CreateAdventureImage(Guid adventureId, CreateAdventureImageDto imageDto);
    }
}
