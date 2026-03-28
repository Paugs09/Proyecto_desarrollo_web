using Core.Infraestructure;
using Infraestructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Infraestructure.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        protected readonly AppDbContext _context;
        internal DbSet<T> _dbSet;

        public GenericRepository(AppDbContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }

        // Obtener todos con posibilidad de incluir tablas relacionadas
        public async Task<IEnumerable<T>> GetAllAsync(params Expression<Func<T, object>>[] includes)
        {
            IQueryable<T> query = _dbSet;
            foreach (var include in includes)
            {
                query = query.Include(include);
            }
            return await query.ToListAsync();
        }

        public async Task<T?> GetByIdAsync(object id)
        {
            return await _dbSet.FindAsync(id);
        }

        //public async Task<T?> FirstOrDefaultAsyncWithIncludes(Expression<Func<T, bool>> predicate, params Expression<Func<T, object>>[] includes)
        //{
        //    IQueryable<T> query = _dbSet;

        //    // Guard clause opcional
        //    if (includes != null)
        //    {
        //        foreach (var include in includes)
        //        {
        //            query = query.Include(include);
        //        }
        //    }

        //    return await query.FirstOrDefaultAsync(predicate);
        //}

        public async Task<T?> FirstOrDefaultAsyncWithIncludes(
            Expression<Func<T, bool>> predicate,
            Func<IQueryable<T>, IQueryable<T>>? includeFunc = null)
        {
            IQueryable<T> query = _dbSet;

            // Aplicamos los includes si el usuario los proporciona
            if (includeFunc != null)
            {
                query = includeFunc(query);
            }

            return await query.FirstOrDefaultAsync(predicate);
        }

        public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate, params Expression<Func<T, object>>[] includes)
        {
            IQueryable<T> query = _dbSet;
            foreach (var include in includes)
            {
                query = query.Include(include);
            }
            return await query.Where(predicate).ToListAsync();
        }

        public async Task AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
        }

        public void Update(T entity)
        {
            _dbSet.Attach(entity);
            _context.Entry(entity).State = EntityState.Modified;
        }

        public async Task DeleteAsync(object id)
        {
            T? entity = await _dbSet.FindAsync(id);
            if (entity != null)
            {
                _dbSet.Remove(entity);
            }
        }

        public async Task<bool> SaveAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
