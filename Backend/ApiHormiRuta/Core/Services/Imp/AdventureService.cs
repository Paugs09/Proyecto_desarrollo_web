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

        public async Task<IEnumerable<AdventureDto>> GetAllAdventuresAsync()
        {
            var adventures = await _genericRepository.GetAllAsync(
                a => a.Category,
                a => a.DifficultyLevel,
                a => a.Images);

            return adventures.Select(x => new AdventureDto
            {
                Id = x.Id,
                Category = x.Category.Name,
                Name = x.Name,
                Description = x.Description,
                Duration = x.Duration,
                MinAge = x.MinAge,
                Difficulty = x.DifficultyLevel.Name,
                MainImageUrl = x.Images.FirstOrDefault(x => x.IsPrimary)?.ImageUrl ?? string.Empty
            });
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

        public async Task UpdateAdventure(Guid id, CreateAdventureDto dto)
        {
            var adventure = await _genericRepository.GetByIdAsync(id);

            adventure.CategoryId = dto.CategoryId;
            adventure.Name = dto.Name;
            adventure.Description = dto.Description;
            adventure.DifficultyId = dto.DifficultyId;
            adventure.Duration = dto.Duration;
            adventure.MinAge = dto.MinAge;
            adventure.PhysicalRequirements = dto.PhysicalRequirements;

            _genericRepository.Update(adventure);
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
                CreatedAt = DateTime.UtcNow
            };

            await _genericAdventureImageRepository.AddAsync(adventureImage);
            await _genericAdventureImageRepository.SaveAsync();
        }
    }
}
