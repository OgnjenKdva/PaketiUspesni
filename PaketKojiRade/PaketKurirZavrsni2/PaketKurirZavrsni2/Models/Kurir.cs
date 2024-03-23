using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace PaketKurirZavrsni2.Models
{
    public class Kurir
    {
        public int Id { get; set; }
        [Required]
        [MaxLength(120)]
        public string Ime { get; set; }
        [Required]
        [Range(1939,2005)]
        public int GodinaRodjenja { get; set; }
        public ICollection<Paket> Paketi { get; set; }
    }
}
