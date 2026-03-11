using Core.Dto.Adventure;
using Core.Entities;
using Core.Infraestructure;
using Core.Services.Interfaces;

namespace Core.Services.Imp
{
    public class AdventureService(IGenericRepository<Adventure> genericRepository) : IAdventureService
    {
        public readonly IGenericRepository<Adventure> _genericRepository = genericRepository;

        public async Task<IEnumerable<Adventure>> GetAllAdventuresAsync()
        {
            return await _genericRepository.GetAllAsync();
        }

        public async Task CreateAdventure(CreateAdventureDto dto) 
        {
            var adventure = new Adventure
            {
                CategoryId = dto.CategoryId,
                Name = dto.Name,
                Description = dto.Description,
                DifficultyId = dto.DifficultyId,
                Duration = dto.Duration,
                MinAge = dto.MinAge,
                PhysicalRequirements = dto.PhysicalRequirements
            };

            await _genericRepository.AddAsync(adventure);
            await _genericRepository.SaveAsync();
        }
    }
}
