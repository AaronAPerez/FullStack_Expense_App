using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    public class Expense
    {
        public int Id { get; set; }

        // [Required]
        public string? Description { get; set; }


        public decimal Amount { get; set; }

          public string? Category { get; set; }
    }
}