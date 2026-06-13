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
  ],
  templateUrl: './dialog-delete-expense-confirmation.component.html',
  styleUrl: './dialog-delete-expense-confirmation.component.scss',
})
export class DialogDeleteExpenseConfirmationComponent {
  protected readonly dialogData = inject<DeleteExpenseConfirmationDialogData>(MAT_DIALOG_DATA);
  private readonly budgetApiMockService: BudgetApiMockService = inject(BudgetApiMockService);

  private readonly dialogRef = inject(
    MatDialogRef<DialogDeleteExpenseConfirmationComponent, undefined>,
  );
  private readonly destroyRef = inject(DestroyRef);

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
