using System.ComponentModel.DataAnnotations;

namespace PaketKurirZavrsni2.Models
{
    public class Paket
    {
        public int Id { get; set; }
        [Required]
        [MinLength(2)]
        [MaxLength(90)]
        public string Posiljalac {  get; set; }
        [Required]
        [MinLength(4)]
        [MaxLength(120)]
        public string Primalac {  get; set; }
        [Required]
        [Range(0, 10)]
        public decimal Tezina {  get; set; }
        [Required]
        [Range(250,10000)]
        public int Postarina { get; set; }
        public bool Dostavljen {  get; set; }
        public int KurirId {  get; set; }
        public Kurir Kurir { get; set; }
    }
}
