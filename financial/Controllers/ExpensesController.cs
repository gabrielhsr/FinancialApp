﻿using Financial.Data.Models.Expense;
using Financial.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Financial.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExpensesController : BaseController<Expense>
    {
        public ExpensesController(IExpensesRepository repository) : base(repository)
        {
        }
    }
}
