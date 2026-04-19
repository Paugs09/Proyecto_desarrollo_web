using Core.Infraestructure;
using Infraestructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace Infraestructure.Persistence
{
    public class UnitOfWork(AppDbContext dbContext) : IUnitOfWork
    {
        private readonly AppDbContext _dbContext = dbContext;
        private IDbContextTransaction _transaction = null!;

        public async Task<IDbContextTransaction> BeginTransactionAsync()
        {
            _transaction = await _dbContext.Database.BeginTransactionAsync();
            return _transaction;
        }

        public IExecutionStrategy CreateExecutionStrategy()
        {
            return _dbContext.Database.CreateExecutionStrategy();
        }

        public async Task SaveChangesAsync()
        {
            await _dbContext.SaveChangesAsync();
        }

        public async Task CommitAsync()
        {
            try
            {
                await SaveChangesAsync();
                if (_transaction != null)
                    await _transaction.CommitAsync();
            }
            catch
            {
                await RollbackAsync();
                throw;
            }
        }

        public async Task RollbackAsync()
        {
            try
            {
                if (_transaction != null)
                    await _transaction.RollbackAsync();
            }
            finally
            {
                _transaction?.Dispose();
            }
        }

        public void Dispose()
        {
            _transaction?.Dispose();
            _dbContext?.Dispose();
        }
    }
}
