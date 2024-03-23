using PaketKurirZavrsni2.Models;
using System.Linq;

namespace PaketKurirZavrsni2.Interfaces
{
    public interface IPaketRepository
    {
        IQueryable<Paket>GetAll();
        public void Add(Paket paket);
        public void Update(Paket paket);
        public void Delete(Paket paket);
        public Paket GetById(int id);
        IQueryable<Paket>GetByTezina(int minTezina,int maxTezina);
        IQueryable<Paket> GetByImePrimaoca(string imePrimaoca);
    }
}
