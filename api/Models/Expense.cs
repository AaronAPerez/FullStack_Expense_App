using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class Expense
    {
        public required int Id { get; set; }
        
        public required string Description { get; set; }

        public required int Amount { get; set; } 

        public required string Category { get; set; }
    }
}