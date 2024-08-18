using System.Collections.Generic;
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
    public async Task<IEnumerable<Expense>> GetExpense()
    {
        var expenses = await _context.Expenses.AsNoTracking().ToListAsync();
        return expenses;
    }

    [HttpPost]
    public async Task<ActionResult> Create(Expense expense)
    {
        if (!ModelState.IsValid)
        {
            return NotFound(ModelState);
        }
        await _context.AddAsync(expense);

        var result = await _context.SaveChangesAsync();

        if (result > 0)
        {
            return Ok("Expense Created Successfully");
        }

        return NotFound("Expense Not Created");

    }


    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var expense = await _context.Expenses.FindAsync(id);
        if (expense == null)
        {
            return NotFound("Expense Not Found");
        }
        _context.Remove(expense);

        var result = await _context.SaveChangesAsync();

        if (result > 0)
        {
            return Ok("Expense deleted successfully");
        }
        return BadRequest("Unable to delete Expense");
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Expense>> GetExpense(int id)
    {
        var expense = await _context.Expenses.FindAsync(id);
        if (expense == null)
        {
            return NotFound("Expense Not Found");
        }
        return Ok(expense);  // Return the actual expense object
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> EditExpense(int id, Expense expense)
    {
        var expenseFromDb = await _context.Expenses.FindAsync(id);

        if (expenseFromDb == null)
        {
            return BadRequest("Student Not Found");
        }
        expenseFromDb.Description = expense.Description;
        expenseFromDb.Amount = expense.Amount;
        expenseFromDb.Category = expense.Category;


        var result = await _context.SaveChangesAsync();

        if (result > 0)
        {
            return Ok(" Expense updated");
        }
        return BadRequest("Unable to update expense");
    }
}