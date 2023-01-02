import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { TranslateService } from '../translate/translate.service';

@Injectable({
	providedIn: 'root',
})
export class FeedbackService {
	constructor(
		private readonly snackBar: MatSnackBar,
		private readonly dialog: MatDialog,
		private readonly translate: TranslateService
	) {}

	public successToast(dictionaryKey?: string, args?: { [key: string]: string }) {
		this.toast(dictionaryKey ? this.translate.instant(dictionaryKey, args) : this.translate.instant('Feedback.GenericSuccess'));
	}

	public errorToast(dictionaryKey?: string, args?: { [key: string]: string }) {
		this.toast(dictionaryKey ? this.translate.instant(dictionaryKey, args) : this.translate.instant('Feedback.GenericError'));
	}

	public toast(message: string) {
		this.snackBar.open(message);
	}

	public confirmCancelDialog(itemName: string) {
		return this.dialog.open<ConfirmDialogComponent, string, { delete: boolean }>(ConfirmDialogComponent, { data: itemName }).afterClosed();
	}
}
