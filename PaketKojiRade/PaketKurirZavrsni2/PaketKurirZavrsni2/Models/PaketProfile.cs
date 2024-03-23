using AutoMapper;
using PaketKurirZavrsni2.DTO;

namespace PaketKurirZavrsni2.Models
{
    public class PaketProfile : Profile
    {
        public PaketProfile()
        {
            CreateMap<Paket,PaketDTO>();
            CreateMap<Paket, PaketDetailDTO>();
        }
    }
}
