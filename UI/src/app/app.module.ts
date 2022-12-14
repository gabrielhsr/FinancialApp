import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CURRENCY_MASK_CONFIG } from 'ng2-currency-mask';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { PagesModule } from './pages/pages.module';

import { TranslateService } from './shared/translate/translate.service';

import localePT from '@angular/common/locales/pt';
import localeEN from '@angular/common/locales/en';

import { AppBase } from './app.base';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';

registerLocaleData(localePT);
registerLocaleData(localeEN);

@NgModule({
	declarations: [AppBase],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		SharedModule,
		PagesModule,
		RouterModule
	],
	providers: [
		{
			provide: DEFAULT_CURRENCY_CODE,
			deps: [TranslateService],
			useFactory: (translateService: TranslateService) => translateService.currency
		},
		{	provide: LOCALE_ID,
			deps: [TranslateService],
			useFactory: (translateService: TranslateService) => translateService.language
		},
		{
			provide: CURRENCY_MASK_CONFIG,
			deps: [TranslateService],
			useFactory: (translateService: TranslateService) => translateService.currencyMask
		},
		{	provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
			useValue: { duration: 2500 }
		}
	],
	bootstrap: [AppBase],
})
export class AppModule {}
