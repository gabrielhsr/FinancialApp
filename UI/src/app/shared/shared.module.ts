import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// Directives
import { AutocompleteDisableDirective } from './directives/autocomplete-disable.directive';
import { TypeSafeMatCellDef } from './directives/type-safe-mat-cell-def.directive';

// Pipes
import { TranslatePipe } from './translate/translate.pipe';

// Services
import { TranslateService } from './translate/translate.service';

// Components
import { TopbarComponent } from './components/topbar/topbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { PeriodSelectComponent } from './components/period-select/period-select.component';
import { YesOrNoDialogComponent } from './components/yes-no-dialog/yes-no-dialog.component';

// Modules
import { MaterialModule } from './material/material.module';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingDirective } from './directives/loading.directive';
import { PreventDefaultDirective } from './directives/prevent-default.directive';


@NgModule({
	declarations: [
		// Directives
		TypeSafeMatCellDef,
		AutocompleteDisableDirective,
		LoadingDirective,
		PreventDefaultDirective,

		// Pipes
		TranslatePipe,

		// Components
		TopbarComponent,
		SidebarComponent,
  		ConfirmDialogComponent,
    	PeriodSelectComponent,
		YesOrNoDialogComponent
	],
	imports: [
		// Modules
		CommonModule,
		MaterialModule,
		RouterModule,
		ReactiveFormsModule,
		FormsModule
	],
	exports: [
		// Modules
		MaterialModule,
		HttpClientModule,
		CurrencyMaskModule,
		ReactiveFormsModule,
		FormsModule,

		// Directives
		TypeSafeMatCellDef,
		AutocompleteDisableDirective,
		LoadingDirective,
		PreventDefaultDirective,

		// Pipes
		TranslatePipe,

		// Components
		TopbarComponent,
		SidebarComponent,
		PeriodSelectComponent
	],
	providers: [TranslateService]
})
export class SharedModule {}
