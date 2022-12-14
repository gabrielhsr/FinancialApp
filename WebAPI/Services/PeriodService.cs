using Financial.Data.DTO;
using Financial.Data.Models;
using Financial.Interfaces.Repositories;
using Financial.Interfaces.Services;

namespace Financial.Services
{
    public class PeriodService : IPeriodService
    {
        private readonly IExpenseService expenseService;
        private readonly IIncomeService incomeService;

        public PeriodService(IExpenseService expenseService, IIncomeService incomeService)
        {
            this.expenseService = expenseService;
            this.incomeService = incomeService;
        }

        public async Task<IList<Period>> GetPeriods()
        {
            var incomePeriods = await incomeService.GetPeriods();
            var expensePeriods = await expenseService.GetPeriods();

            var periods = incomePeriods
                .Concat(expensePeriods)
                .OrderBy(x => new DateTime(x.Year, x.Month, 1))
                .Distinct()
                .ToList();

            return periods;
        }
    }
}
