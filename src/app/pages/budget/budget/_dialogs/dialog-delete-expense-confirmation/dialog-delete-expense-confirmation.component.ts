import { Component, DestroyRef, inject } from '@angular/core';
import { Budget, Expense } from '../../../types/expense.types';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ExpenseStatusPipe } from '../../../pipes/expense-status.pipe';
import { DefaultValuePipe } from '../../../../../shared/pipes/default-value.pipe';
import { BudgetApiMockService } from '../../../budget-api-mock.service';
import { DatePipe } from '@angular/common';
import { GlobalConfig } from '../../../../../core/global-config/global-config.class';

export interface DeleteExpenseConfirmationDialogData {
  expense: Expense;
}

@Component({
  selector: 'app-dialog-delete-expense-confirmation',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    ExpenseStatusPipe,
    DefaultValuePipe,
    DatePipe,
  ],
  templateUrl: './dialog-delete-expense-confirmation.component.html',
  styleUrl: './dialog-delete-expense-confirmation.component.scss',
})
export class DialogDeleteExpenseConfirmationComponent {
  protected readonly dialogData: DeleteExpenseConfirmationDialogData = inject(MAT_DIALOG_DATA);
  protected readonly globalConfig: typeof GlobalConfig = GlobalConfig;
  private readonly budgetApiMockService: BudgetApiMockService = inject(BudgetApiMockService);

  private readonly dialogRef: MatDialogRef<DialogDeleteExpenseConfirmationComponent, Budget> =
    inject(MatDialogRef);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  protected close(budget?: Budget): void {
    this.dialogRef.close(budget);
  }

  protected delete(): void {
    this.budgetApiMockService
      .deleteExpense(this.dialogData.expense.id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res) => this.close(res)),
      )
      .subscribe();
  }
}
