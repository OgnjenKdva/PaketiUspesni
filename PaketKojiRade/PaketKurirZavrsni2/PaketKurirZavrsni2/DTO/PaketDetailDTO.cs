namespace PaketKurirZavrsni2.DTO
{
    public class PaketDetailDTO
    {
        public int Id { get; set; }
        public string Posiljalac { get; set; }
        public string Primalac { get; set; }
        public decimal Tezina { get; set; }
        public int Postarina { get; set; }
        public string KurirIme { get; set; }
        public bool Dostavljen { get; set; }
    }
}
