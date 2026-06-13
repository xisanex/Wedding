import { Pipe, PipeTransform } from '@angular/core';
import { ExpenseStatus } from '../types/expense.types';

@Pipe({
  name: 'expenseStatus',
})
export class ExpenseStatusPipe implements PipeTransform {
  transform(value?: ExpenseStatus): string | undefined {
    switch (value) {
      case ExpenseStatus.NonPaid:
        return 'Nieopłacone';
      case ExpenseStatus.Paid:
        return 'Opłacone';
      default:
        return undefined;
    }
  }
}
