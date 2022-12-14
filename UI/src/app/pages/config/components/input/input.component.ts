import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, NgModel } from '@angular/forms';
import { EMPTY, Subject, Subscription, switchMap } from 'rxjs';
import { CategoryEndpoint } from 'src/app/entities/category/category.endpoint';
import { Category } from 'src/app/entities/category/category.model';
import { PaymentMethodEndpoint } from 'src/app/entities/paymentMethod/paymentMethod.endpoint';
import { PaymentMethod } from 'src/app/entities/paymentMethod/paymentMethod.model';
import { GuidHelper } from 'src/app/shared/helpers/guid.helper';
import { FeedbackService } from 'src/app/shared/services/feedback.service';

export type ItemType = 'category' | 'paymentMethod';
type ItemUnion = PaymentMethod | Category;

@Component({
	selector: 'config-input',
	templateUrl: './input.component.html',
	styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit, OnDestroy {
	@ViewChild('inputModel') public input?: NgModel;
	@ViewChild('inputElement') public element?: ElementRef;

	@Input() public item!: ItemUnion;
	@Input() public type!: ItemType;
	@Input() public list?: Category[] | PaymentMethod[];

	@Output() public itemUpdated = new EventEmitter<void>();

	public loading: boolean = false;
	public subject = new Subject<ItemUnion>();

	private subject$?: Subscription;

	public form = new FormControl('');

	constructor(
		private readonly categoryEndpoint: CategoryEndpoint,
		private readonly paymentMethodEndpoint: PaymentMethodEndpoint,
		private readonly feedback: FeedbackService
	) {}

	public ngOnInit() {
		this.subject$ = this.subject
			.pipe(switchMap((item) => this.type === 'category' ? this.saveCategory(item) : this.savePaymentMethod(item)))
			.subscribe((res) => {
				if (res.isSuccess) {
					this.feedback.successToast("Pages.Config.SavedWithSuccess");
				}

				this.itemUpdated.emit();
				this.loading = false;
			});
	}

	public ngOnDestroy() {
		this.subject$?.unsubscribe();
	}

	public onBlur(event: FocusEvent, item: ItemUnion) {
		this.input?.control.setErrors(null);

		const element = event.target as HTMLInputElement;
		const inputValue = element.value.trim();
		const listToSearch = this.list?.filter(x => x.id !== item.id).filter(x => x.name != '');

		if (listToSearch?.find(x => x.name?.toLowerCase() === inputValue.toLowerCase())) {
			this.input?.control.setErrors({ 'alreadyExist': true });
			return;
		}

		if (inputValue != item.name) {
			this.loading = true;

			const newItem: ItemUnion = { ...item, name: inputValue.length > 0 ? inputValue : null };

			this.subject.next(newItem);
		}
	}

	public saveCategory(category: Category) {
		return GuidHelper.isNullOrDefault(category.id) ? this.categoryEndpoint.post(category) : this.categoryEndpoint.put(category, category.id);
	}

	public savePaymentMethod(paymentMethod: PaymentMethod) {
		return GuidHelper.isNullOrDefault(paymentMethod.id) ? this.paymentMethodEndpoint.post(paymentMethod) : this.paymentMethodEndpoint.put(paymentMethod, paymentMethod.id);
	}

	public deleteItem(item: ItemUnion) {
		const itemName = item.name;

		const operation = this.type  === 'category' ? this.categoryEndpoint.delete(item.id) : this.paymentMethodEndpoint.delete(item.id);

		if (!itemName) {
			this.itemUpdated.emit();
			return;
		}

		this.feedback
			.confirmCancelDialog(itemName)
			.pipe(switchMap((res) => res?.confirm ? operation : EMPTY))
			.subscribe((res) => {
				if (res.isSuccess) {
					this.feedback.successToast('Feedback.DeleteSuccess');
				} else {
					if (res.type === 'entityInUse') this.feedback.errorToast('Pages.Config.Errors.EntityInUse', { itemName });
				}

				this.itemUpdated.emit();
			});
	}

	public focus() {
		this.element?.nativeElement.focus();
	}
}
