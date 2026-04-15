using System.Linq.Expressions;

namespace Core.Infraestructure
{
    public interface IGenericRepository<T> where T : class
    {
        Task<IEnumerable<T>> GetAllAsync(Func<IQueryable<T>, IQueryable<T>>? includeFunc = null);
        Task<T?> GetByIdAsync(object id);
        Task<T?> FirstOrDefaultAsyncWithIncludes(
            Expression<Func<T, bool>> predicate,
            Func<IQueryable<T>, IQueryable<T>>? includeFunc = null);
        Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate, Func<IQueryable<T>, IQueryable<T>>? includeFunc = null);
        Task AddAsync(T entity);
        Task AddRangeAsync(List<T> entities);
        void Update(T entity);
        Task DeleteAsync(object id);
        Task<bool> SaveAsync();
    }
}
