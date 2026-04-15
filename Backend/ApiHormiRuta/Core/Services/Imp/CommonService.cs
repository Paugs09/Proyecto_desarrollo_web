using Core.Dto.Category;
using Core.Entities;
using Core.Infraestructure;
using Core.Services.Interfaces;

namespace Core.Services.Imp
{
    public class CommonService(ICommonRepository commonRepository,
                               IGenericRepository<Category> genericCategoryRepository,
                               IGenericRepository<Material> genericMaterialRepository,
                               IGenericRepository<Entities.Attribute> genericAttributeRepository,
                               IGenericRepository<Municipality> genericMunicipalityRepository) : ICommonService
    {
        private readonly ICommonRepository _commonRepository = commonRepository;
        private readonly IGenericRepository<Category> _genericCategoryRepository = genericCategoryRepository;
        private readonly IGenericRepository<Material> _genericMaterialRepository = genericMaterialRepository;
        private readonly IGenericRepository<Entities.Attribute> _genericAttributeRepository = genericAttributeRepository;
        private readonly IGenericRepository<Municipality> _genericMunicipalityRepository = genericMunicipalityRepository;

        public async Task<IEnumerable<CategoryPresentationDto>> GetPresentationCategoryList()
        {
            var categories = await _genericCategoryRepository.GetAllAsync();

            return categories.Select(c => new CategoryPresentationDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                ImageUrl = c.ImageUrl
            });
        }

        public async Task<IEnumerable<GeneralInfo>> Common(string parameter)
        {
            if (parameter == "municipality") 
            {
                var municipalities = await _genericMunicipalityRepository.GetAllAsync();
                return municipalities.Select(m => new GeneralInfo
                {
                    Id = m.Id,
                    Name = m.Name,
                    CreatedAt = m.CreatedAt
                });
            }
            else if (parameter == "category")
            {
                var categories = await _genericCategoryRepository.GetAllAsync();
                return categories.Select(c => new GeneralInfo
                {
                    Id = c.Id,
                    Name = c.Name,
                    CreatedAt = c.CreatedAt
                });
            }
            else if (parameter == "material")
            {
                var materials = await _genericMaterialRepository.GetAllAsync();
                return materials.Select(m => new GeneralInfo
                {
                    Id = m.Id,
                    Name = m.Name,
                    CreatedAt = m.CreatedAt
                });
            }
            else if (parameter == "attribute")
            {
                var attributes = await _genericAttributeRepository.GetAllAsync();
                return attributes.Select(a => new GeneralInfo
                {
                    Id = a.Id,
                    Name = a.Name,
                    CreatedAt = a.CreatedAt
                });
            }
            else
            {
                return [];
            }
        }
    }
}
