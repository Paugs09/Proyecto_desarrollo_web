using Core.Entities;
using Core.Infraestructure;
using Infraestructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infraestructure.Repositories
{
    public class CommonRepository(AppDbContext context) : ICommonRepository
    {
        private readonly AppDbContext _context = context;

    }
}
