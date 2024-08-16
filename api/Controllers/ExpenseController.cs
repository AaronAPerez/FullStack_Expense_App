using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExpenseController : ControllerBase
{
    private readonly AppDbContext _context;
    public ExpenseController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IEnumerable<Expense>> getExpenses()
    {
        var expenses = await _context.Expenses.AsNoTracking().ToListAsync();
        return expenses;
    }

    [HttpPost]
    public async Task<IActionResult> Create(Expense expense)
    {
        if(!ModelState.IsValid)
        {
            return NotFound(ModelState);
        }
        await _context.AddAsync(expense);

        var result = await _context.SaveChangesAsync();

        if(result > 0)
        {
            return Ok("Expense Created Successfully");
        }
        
        return NotFound("Expense Not Created");
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Delete(int id)
    {
       var expense = await _context.Expenses.FindAsync(id);
       if(expense == null)
       {
            return NotFound("Expense Not Found");
       }

       _context.Remove(expense);

       var result = await _context.SaveChangesAsync();

       if (result > 0) 
       {
        return Ok("Expense deleted successfully");
       }
       return BadRequest("Unable to delete expense");
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Expense>> GetExpense(int id)
    {
        var expense = await _context.Expenses.FindAsync(id);
        if(expense == null)
        {
            return NotFound("Expense Not Found");
        }
        return Ok(expense);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> EditExpense(int id, Expense expense)
    {
        var expenseFromDb = await _context.Expenses.FindAsync(id);

        if (expenseFromDb == null)
        {
            return BadRequest("Expense Not Found");
        }
        expenseFromDb.Description = expense.Description;
        expenseFromDb.Amount = expense.Amount;
        expenseFromDb.Category = expense.Category;

        var result = await _context.SaveChangesAsync();

        if (result > 0)
        {
            return Ok("Expense updated");
        }
        return BadRequest("Unable to update expense");
    }
}

    //    public int Id { get; set; }

    //     public string Description { get; set; } = "";

    //     public int Amount { get; set; } 
    //     public string Category { get; set; } = "";
// using System;
// using System.Collections.Generic;
// using System.Linq;
// using System.Threading.Tasks;
// using api.Data;
// using api.Model;
// using api.Models;
// using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore;

// namespace api.Controllers;

//     [ApiController]
//     [Route("api/[controller]")]
//     public class ExpenseController : ControllerBase
//     {
//         private readonly AppDbContext _context;
//         public ExpenseController(AppDbContext context)
//         {
//             _context = context;
//         }

//         [HttpGet]
//         public async Task<IEnumerable<Expense>> getExpense()
//         {
//             var Expenses = await _context.Expenses.AsNoTracking().ToListAsync();
//             return Expenses;
//         }

//         [HttpPost]

//         public async Task<IActionResult> Create(Expense Expense)
//         {
//             if(!ModelState.IsValid)
//             {
//                 return NotFound(ModelState);
//             }
//             await _context.AddAsync(Expense);

//                 var result = await _context.SaveChangesAsync();

//                 if(result > 0)
//                 {
//                     return Ok("Expense Created Successfully");
//                 }
                
//                 return NotFound("Expense Not Created");
            
//         }
//         //Delete delete
//         [HttpDelete("{id:int}")]

//         public async Task<ActionResult> Delete(int id)
//         {
//            var expense = await _context.Expenses.FindAsync(id);
//            if(expense == null)
//            {
//                 return NotFound("Expense Not Found");
//            }

//            _context.Remove(Expense);

//            var result = await _context.SaveChangesAsync();

//            if (result > 0) 
//            {
//             return Ok("Expense deleted successfully");
//            }
//            return BadRequest("Unable to delete Expense");
//         }
//         //Get a single Expense by ID

//         [HttpGet("{id:int}")]

//         public async Task<ActionResult<Expense>> GetExpense(int id)
//         {
//             var Expense = await _context.Expenses.FindAsync(id);
//             if(Expense == null)
//             {
//                 return NotFound("Expense Not Found");
//             }
//             return Ok("Expense");
//         }

//         //Update PUT
//         [HttpPut("{id:int}")]

//         public async Task<IActionResult> EditExpense(int id, Expense expense)
//         // Find the Expense by ID
//         {
//             var expenseFromDb = await _context.Expenses.FindAsync(id);

//             if (ExpenseFromDb == null)
//             {
//                 return BadRequest("Expense Not Found");
//             }
//             ExpenseFromDb.Name = Expense.Name;
//             ExpenseFromDb.Email = Expense.Email;
//             ExpenseFromDb.Address = Expense.Address;
//             ExpenseFromDb.PhoneNumber = Expense.PhoneNumber;

//             var result = await _context.SaveChangesAsync();

//             if (result > 0)
//             {
//                 return Ok("Expense updated");
//             }
//                 return BadRequest("Unable to update Expense");
//         }
//     }