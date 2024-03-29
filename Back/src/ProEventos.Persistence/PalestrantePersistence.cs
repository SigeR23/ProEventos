using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProEventos.Domain;
using ProEventos.Persistence.Contextos;
using ProEventos.Persistence.Contratos;

namespace ProEventos.Persistence
{
    public class PalestrantePersistence : IPalestrantePersistence
    {
        private readonly ProEventosContext _context;
        public PalestrantePersistence(ProEventosContext context)
        {
            _context = context;
            
        }
        
        public async Task<Palestrante[]> GetAllPalestrantesAsync(bool includePalestrantes = false)
        {
            IQueryable<Palestrante> query = _context.Palestrantes
                .Include(p => p.RedesSociais);

            if (includePalestrantes) {
                query = query.Include(p => p.PalestrantesEventos)
                        .ThenInclude(pe => pe.Evento);  
            }
                
            query = query.AsNoTracking().OrderBy(p => p.Id);
            return await query.ToArrayAsync();
        }

        public async Task<Palestrante> GetPalestranteByIdAsync(int id, bool includeEventos = false)
        {
            IQueryable<Palestrante> query = _context.Palestrantes
                .Include(p => p.RedesSociais);

            if (includeEventos) {
                query = query.Include(p => p.PalestrantesEventos)
                        .ThenInclude(pe => pe.Evento);  
            }
 
            query = query.AsNoTracking().OrderBy(p => p.Id)
                .Where(p => p.Id == id);
            return await query.FirstOrDefaultAsync();
        }

        public async Task<Palestrante[]> GetAllPalestrantesByNomeAsync(string nome, bool includeEventos = false)
        {
            IQueryable<Palestrante> query = _context.Palestrantes
                .Include(p => p.RedesSociais);

            if (includeEventos) {
                query = query.Include(p => p.PalestrantesEventos)
                        .ThenInclude(pe => pe.Evento);  
            }
  
            query = query.AsNoTracking().OrderBy(p => p.Id)
                .Where(p => p.Nome.ToLower().Contains(nome.ToLower()));
            return await query.ToArrayAsync();
        }
    }
}