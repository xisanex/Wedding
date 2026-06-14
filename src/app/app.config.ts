import {
  ApplicationConfig,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { GlobalConfig } from './core/global-config/global-config.class';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatDatepickerIntl } from '@angular/material/datepicker';

const MY_DATE_FORMATS = {
  parse: {
    dateInput: {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    },
  },
  display: {
    dateInput: {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    },
    monthYearLabel: {
      month: 'short',
      year: 'numeric',
    },
    dateA11yLabel: {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    },
    monthYearA11yLabel: {
      month: 'long',
      year: 'numeric',
    },
  },
};

function getPolishPaginatorIntl(): MatPaginatorIntl {
  const paginatorIntl = new MatPaginatorIntl();

  paginatorIntl.itemsPerPageLabel = 'Elementów na stronę:';
  paginatorIntl.nextPageLabel = 'Następna strona';
  paginatorIntl.previousPageLabel = 'Poprzednia strona';
  paginatorIntl.firstPageLabel = 'Pierwsza strona';
  paginatorIntl.lastPageLabel = 'Ostatnia strona';
  paginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 z ${length}`;
    }

    const startIndex = page * pageSize;
    const endIndex = Math.min(startIndex + pageSize, length);

    return `${startIndex + 1} - ${endIndex} z ${length}`;
  };

  return paginatorIntl;
}
export function getPolishDatepickerIntl(): MatDatepickerIntl {
  const intl = new MatDatepickerIntl();

  intl.calendarLabel = 'Kalendarz';
  intl.openCalendarLabel = 'Otwórz kalendarz';
  intl.comparisonDateLabel = 'Porównanie dat';
  intl.closeCalendarLabel = 'Zamknij kalendarz';
  intl.prevMonthLabel = 'Poprzedni miesiąc';
  intl.nextMonthLabel = 'Następny miesiąc';
  intl.prevYearLabel = 'Poprzedni rok';
  intl.nextYearLabel = 'Następny rok';
  intl.prevMultiYearLabel = 'Poprzednie 24 lata';
  intl.nextMultiYearLabel = 'Następne 24 lata';
  intl.switchToMonthViewLabel = 'Przełącz na widok miesięcy';
  intl.switchToMultiYearViewLabel = 'Wybierz rok';

  return intl;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    { provide: LOCALE_ID, useValue: GlobalConfig.DATE_LOCALE },
    provideNativeDateAdapter(MY_DATE_FORMATS),
    { provide: MAT_DATE_LOCALE, useValue: GlobalConfig.DATE_LOCALE },
    { provide: MatPaginatorIntl, useFactory: getPolishPaginatorIntl },
    { provide: MatDatepickerIntl, useFactory: getPolishDatepickerIntl },
  ],
};
