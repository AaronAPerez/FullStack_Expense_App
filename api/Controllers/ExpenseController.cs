using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExpenseController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ExpenseController(AppDbContext context)
        {
            _context = context;
        }

        // [HttpGet]
        [HttpGet("GetExpenses")]
        public async Task<IEnumerable<Expense>> GetExpense()
        {
                 var expenses = await _context.Expenses.AsNoTracking().ToListAsync();
            return expenses;
        }

        // [HttpPost]
        [HttpPost("AddExpense")]
        public async Task<IActionResult> Create (Expense expense)
        {  if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await _context.AddAsync(expense);

            var result = await _context.SaveChangesAsync();

            if (result > 0)
            {
                return Ok();
            }
            return BadRequest();
        }


        

           // Delete Expense Item
        [HttpDelete("Delete/{id:int}")]
        public async Task<IActionResult> DeleteExpense(int id)
        {
            var expense = await _context.Expenses.FindAsync(id);
            if(expense == null)
            {
                return NotFound();
            }

            _context.Remove(expense);

            var result = await _context.SaveChangesAsync();

            if (result > 0)
            {
                return Ok("Expense item deleted");
            }

            return BadRequest("Unable to delete expense item");
        }

         // Edit Expense Item by id
        [HttpPut("Edit/{id:int}")]
        public async Task<IActionResult> EditExpense(int id, Expense expense)
        {
            // save the expense from the database found by id
            var expenseFromDb = await _context.Expenses.FindAsync(id);

            // check if the database with that id is empty & return bad request
            if(expenseFromDb == null)
            {
                return BadRequest("Expense not found");  
            }

            // if expense at id is not empty then update data based upon what is taken as input
            expenseFromDb.Description = expense.Description;
            expenseFromDb.Amount = expense.Amount;
            expenseFromDb.Category = expense.Category;

            // save changes to the variable result
            var result = await _context.SaveChangesAsync();

            // if result is not empty then return Ok
            if(result > 0)
            {
                return Ok("Expense information updated for " + expense.Description);
            }

            // if result is empty return BadRequest with message
            return BadRequest("Unable to update the expense item " + expense.Description);

        }
    }
}

  