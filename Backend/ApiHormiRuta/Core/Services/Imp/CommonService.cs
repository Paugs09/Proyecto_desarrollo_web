using Core.Dto.Category;
using Core.Entities;
using Core.Infraestructure;
using Core.Services.Interfaces;

namespace Core.Services.Imp
{
    public class CommonService(ICommonRepository commonRepository,
                               IGenericRepository<Category> genericCategoryRepository) : ICommonService
    {
        private readonly ICommonRepository _commonRepository = commonRepository;
        private readonly IGenericRepository<Category> _genericCategoryRepository = genericCategoryRepository;

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

    }
}
