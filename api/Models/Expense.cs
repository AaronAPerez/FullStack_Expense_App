using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models;

public class Expense
{
    public int Id { get; set;}
    // public string Name { get; set; } = "";
    public string Description { get; set; } = "";

    public string Amount { get; set; } ="";
    // public string Price { get; set; } ="";
      public string Category { get; set; } = "";

    // public bool IsInStore { get; set; }
}