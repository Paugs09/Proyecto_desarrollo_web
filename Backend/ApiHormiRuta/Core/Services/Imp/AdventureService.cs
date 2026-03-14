using Core.Dto.Adventure;
using Core.Entities;
using Core.Infraestructure;
using Core.Services.Interfaces;

namespace Core.Services.Imp
{
    public class AdventureService(IStorageService storageService, 
                                  IGenericRepository<Adventure> genericRepository,
                                  IGenericRepository<AdventureImage> genericAdventureImageRepository) : IAdventureService
    {
        public readonly IStorageService _storageService = storageService;
        public readonly IGenericRepository<Adventure> _genericRepository = genericRepository;
        public readonly IGenericRepository<AdventureImage> _genericAdventureImageRepository = genericAdventureImageRepository;

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

        public async Task CreateAdventureImage(Guid adventureId, CreateAdventureImageDto imageDto)
        {
            var imagePath = await _storageService.UploadImageAsync(imageDto.FormFile, "adventures");

            var adventureImage = new AdventureImage
            {
                AdventureId = adventureId,
                DisplayOrder = imageDto.DisplayOrder,
                IsPrimary = imageDto.IsPrimary,
                ImageUrl = imagePath,
                CreatedAt = DateTime.Now
            };

            await _genericAdventureImageRepository.AddAsync(adventureImage);
            await _genericAdventureImageRepository.SaveAsync();
        }
    }
}
