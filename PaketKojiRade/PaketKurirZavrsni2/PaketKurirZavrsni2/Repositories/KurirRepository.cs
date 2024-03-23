using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using PaketKurirZavrsni2.DTO;
using PaketKurirZavrsni2.Interfaces;
using PaketKurirZavrsni2.Models;
using System.Collections.Generic;
using System.Linq;

namespace PaketKurirZavrsni2.Repositories
{
    public class KurirRepository : IKurirRepository
    {
        private readonly AppDbContext _appDbContext;

        public KurirRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public void Add(Kurir kurir)
        {
            _appDbContext.Add(kurir);
            _appDbContext.SaveChanges();
        }

        public void Delete(Kurir kurir)
        {
            _appDbContext.Remove(kurir);
            _appDbContext.SaveChanges();
        }

        public IQueryable<Kurir> GetAll()
        {
            return _appDbContext.Kuriri.OrderBy(k => k.Ime);
        }

        public Kurir GetById(int id)
        {
            return _appDbContext.Kuriri.FirstOrDefault(k => k.Id == id);
        }

        public IQueryable<Kurir> GetByIme(string ime)
        {
            var data = _appDbContext.Kuriri
                .Where(k => k.Ime.Contains(ime))
                .OrderByDescending(k => k.GodinaRodjenja)
                .ThenBy(k => k.Ime);
            return data;
        }

        public List<TezinaDTO> UkupnaTezina(decimal tezina)
        {
            var data = _appDbContext.Paketi.Include(p => p.Kurir)
                .GroupBy(p => p.KurirId)
                .Select(group => new TezinaDTO
                {

                    KurirIme = _appDbContext.Kuriri.Where(k => k.Id == group.Key).Select(k => k.Ime).Single(),
                    UkupnaTezina = group.Sum(p => p.Tezina)
                })
                .OrderByDescending(dto => dto.KurirIme);
            return data.Where(d => d.UkupnaTezina <= tezina).ToList();
        }

        public List<StanjeDTO> UkupnoPaketa()
        {
            var data = _appDbContext.Paketi.Include(p => p.Kurir)
                .ToList()
                .GroupBy(p => p.KurirId)
                .Select(group => new StanjeDTO
                {
                    KurirIme = _appDbContext.Kuriri.Where(k => k.Id == group.Key).Select(k => k.Ime).Single(),
                    UkupanBrojPaketa = group.Sum(p => p.Kurir.Paketi.Count)
                })
                .OrderByDescending(dto => dto.UkupanBrojPaketa);
            return data.ToList();
        }

        public void Update(Kurir kurir)
        {
            _appDbContext.Entry(kurir).State = EntityState.Modified;

            try
            {
                _appDbContext.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
        }
    }
}
