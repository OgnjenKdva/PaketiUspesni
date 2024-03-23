using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace PaketKurirZavrsni2.Models
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public DbSet<Kurir> Kuriri { get; set; }
        public DbSet<Paket> Paketi { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Kurir>().HasData(
                    new Kurir() { Id = 1, Ime = "Boban", GodinaRodjenja = 1998 },
                    new Kurir() { Id = 2, Ime = "Marko", GodinaRodjenja = 2000 },
                    new Kurir() { Id = 3, Ime = "Mitar", GodinaRodjenja = 1995 }
                );
            builder.Entity<Paket>().HasData(
                    new Paket() { Id = 1, Posiljalac = "Galens", Primalac = "Vega", Tezina = 5, Dostavljen = true, KurirId = 1 },
                    new Paket() { Id = 2, Posiljalac = "Maxi", Primalac = "Idea", Tezina = 7, Dostavljen = false, KurirId = 2 },
                    new Paket() { Id = 3, Posiljalac = "Giros Master", Primalac = "GreenNet", Tezina = 4, Dostavljen = true, KurirId = 3 }
                );

            base.OnModelCreating(builder);
        }
    }
}
