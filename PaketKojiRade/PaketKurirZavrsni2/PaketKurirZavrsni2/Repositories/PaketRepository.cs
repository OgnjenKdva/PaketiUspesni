using Microsoft.EntityFrameworkCore;
using PaketKurirZavrsni2.Interfaces;
using PaketKurirZavrsni2.Models;
using System.Linq;

namespace PaketKurirZavrsni2.Repositories
{
    public class PaketRepository : IPaketRepository
    {
        private readonly AppDbContext _context;

        public PaketRepository(AppDbContext context)
        {
            _context = context;
        }

        public void Add(Paket paket)
        {
            _context.Add(paket);
            _context.SaveChanges();
        }

        public void Delete(Paket paket)
        {
            _context.Remove(paket);
            _context.SaveChanges();
        }

        public IQueryable<Paket> GetAll()
        {
            return _context.Paketi.Include(p => p.Kurir)
                .OrderBy(p => p.Tezina);
        }

        public Paket GetById(int id)
        {
            return _context.Paketi.Include(p => p.Kurir).FirstOrDefault(p => p.Id == id);
        }

        public IQueryable<Paket> GetByImePrimaoca(string imePrimaoca)
        {
            var data = _context.Paketi.Include(p => p.Kurir)
                .Where(p => p.Primalac.Contains(imePrimaoca))
                .OrderBy(p => p.Postarina);
            return data;
        }

        public IQueryable<Paket> GetByTezina(int minTezina, int maxTezina)
        {
            var data = _context.Paketi.Include(p => p.Kurir)
                .Where(p => p.Tezina >= minTezina && p.Tezina <= maxTezina);

            return data;
        }

        public void Update(Paket paket)
        {
            _context.Entry(paket).State = EntityState.Modified;

            try
            {
                _context.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
        }
    }
}
