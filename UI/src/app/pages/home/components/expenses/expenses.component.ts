import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Subject, switchMap } from 'rxjs';
import { Expense } from 'src/app/entities/expense/expense.model';
import { Period } from 'src/app/entities/period/period.dto';
import { ExpenseService } from 'src/app/shared/services/expense.service';
import { FeedbackService } from 'src/app/shared/services/feedback.service';

@Component({
	selector: 'app-expenses-table',
	templateUrl: './expenses.component.html',
	styleUrls: ['./expenses.component.scss'],
})
export class ExpensesComponent implements OnChanges {
	@Input() selectedPeriod?: Period;
	public periodExpenses?: Expense[];

	public displayedColumns: string[] = [...Object.keys(new Expense()), 'options'].filter((x) => x !== 'id');
	public expensesLoading: boolean = true;

	public periodSubject = new Subject<Period>();

	public openedPanels: string[] = [];

	constructor(
		private readonly expenseService: ExpenseService,
		private readonly feedback: FeedbackService
	) {
		this.periodSubject
			.pipe(switchMap((period) => this.expenseService.getExpensesByPeriod(period)))
			.subscribe((res) => {
				if (res.isSuccess) {
					this.periodExpenses = res.value;
					this.expensesLoading = false;
				}
			});
	}

	public ngOnChanges(changes: SimpleChanges) {
		const selectedPeriod: Period = changes['selectedPeriod']?.currentValue;

		if (selectedPeriod) {
			this.expensesLoading = true;
			this.periodSubject.next(selectedPeriod);
		}
	}

	public deleteExpense(expense: Expense) {
		this.feedback
			.confirmCancelDialog(expense.description)
			.subscribe((res) => {
				if (!res?.deleted) return;

				this.expenseService
					.removeExpense(expense.id)
					.subscribe((res) => {
						if (res.isSuccess) this.feedback.successToast('Feedback.DeleteSuccess');
					});
			});
	}

	public editExpense(expense: Expense) {
		this.expenseService.openExpenseDialog(expense);
	}

	public forgetPanel(id: string) {
		return this.openedPanels = this.openedPanels.filter(x => x !== id);
	}
}
