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
    public async Task<IActionResult> Expenses()
    {
      
        return Ok(await _context.Expenses.AsNoTracking().ToListAsync());
    }

    [HttpPost]
    public async Task<IActionResult> CreateExpenses(Expense expense)
    {
        if(expense is null)
        {
            return BadRequest();
        }

        await _context.Expenses.AddAsync(expense);
        await _context.SaveChangesAsync();

        return Ok(expense);


    }

    [HttpGet("{id}")]

    public async Task<IActionResult> GetExpenses(int id)
    {
        var expense = await _context.Expenses.FindAsync(id);
        if(expense is null)
        {
            return NotFound();
        }
        return Ok(expense);
    }

   [HttpPut("{id}")]

    public async Task<IActionResult> UpdateExpense(int id, Expense expense)
    {
        if(id != expense.Id)
        {
            return BadRequest();
        }
        _context.Entry(expense).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return Ok();
    }

    [HttpDelete("{id}")]

    public async Task<IActionResult> DeleteExpense(int id)
    {
        var expense =  await _context.Expenses.FindAsync(id);

        if(expense is null)
        {
            return NotFound();
        }

        _context.Expenses.Remove(expense);
        await _context.SaveChangesAsync();

        return Ok(expense);


    }


}

    // [HttpPost]
    // public async Task<IActionResult> CreateExpenses(Expense expense)
    // {
    //     if(!ModelState.IsValid)
    //     {
    //         return NotFound(ModelState);
    //     }
    //     await _context.AddAsync(expense);

    //     var result = await _context.SaveChangesAsync();

    //     if(result > 0)
    //     {
    //         return Ok("Expense Created Successfully");
    //     }
        
    //     return NotFound("Expense Not Created");
    // }

//     [HttpDelete("{id:int}")]
//     public async Task<ActionResult> Delete(int id)
//     {
//        var expense = await _context.Expenses.FindAsync(id);
//        if(expense == null)
//        {
//             return NotFound("Expense Not Found");
//        }

//        _context.Remove(expense);

//        var result = await _context.SaveChangesAsync();

//        if (result > 0) 
//        {
//         return Ok("Expense deleted successfully");
//        }
//        return BadRequest("Unable to delete expense");
//     }

//     [HttpGet("{id:int}")]
//     public async Task<ActionResult<Expense>> GetExpense(int id)
//     {
//         var expense = await _context.Expenses.FindAsync(id);
//         if(expense == null)
//         {
//             return NotFound("Expense Not Found");
//         }
//         return Ok("expense");
//     }

//     [HttpPut("{id:int}")]
//     public async Task<IActionResult> EditExpense(int id, Expense expense)
//     {
//         var expenseFromDb = await _context.Expenses.FindAsync(id);

//         if (expenseFromDb == null)
//         {
//             return BadRequest("Expense Not Found");
//         }
//         expenseFromDb.Description = expense.Description;
//         expenseFromDb.Amount = expense.Amount;
//         expenseFromDb.Category = expense.Category;

//         var result = await _context.SaveChangesAsync();

//         if (result > 0)
//         {
//             return Ok("Expense updated");
//         }
//         return BadRequest("Unable to update expense");
//     }
// }

