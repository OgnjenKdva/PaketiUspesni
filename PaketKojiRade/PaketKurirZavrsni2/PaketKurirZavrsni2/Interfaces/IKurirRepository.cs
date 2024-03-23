using PaketKurirZavrsni2.DTO;
using PaketKurirZavrsni2.Models;
using System.Collections.Generic;
using System.Linq;

namespace PaketKurirZavrsni2.Interfaces
{
    public interface IKurirRepository
    {
        IQueryable<Kurir> GetAll();
        public void Add(Kurir kurir);
        public void Update(Kurir kurir);
        public void Delete(Kurir kurir);
        public Kurir GetById(int id);
        IQueryable<Kurir> GetByIme(string ime);
        List<StanjeDTO> UkupnoPaketa();
        List<TezinaDTO> UkupnaTezina(decimal tezina);

    }
}
