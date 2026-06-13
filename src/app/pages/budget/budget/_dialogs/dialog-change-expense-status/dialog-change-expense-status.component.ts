import { Component, DestroyRef, inject, LOCALE_ID, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Budget, Expense, ExpenseStatus } from '../../../types/expense.types';
import { DefaultValuePipe } from '../../../../../shared/pipes/default-value.pipe';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { formatDate } from '@angular/common';
import { BudgetApiMockService } from '../../../budget-api-mock.service';

export interface ChangeExpenseStatusDialogData {
  expense: Expense;
}

@Component({
  selector: 'app-dialog-change-expense-status',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    DefaultValuePipe,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './dialog-change-expense-status.component.html',
  styleUrl: './dialog-change-expense-status.component.scss',
})
export class DialogChangeExpenseStatusComponent implements OnInit {
  private readonly LOCALE_ID = inject(LOCALE_ID);

  protected readonly dialogData = inject<ChangeExpenseStatusDialogData>(MAT_DIALOG_DATA);
  protected statusToSet!: ExpenseStatus;
  protected readonly dateOfPaymentControl: FormControl<string | null> = new FormControl(
    formatDate(new Date(), 'yyyy-MM-dd', this.LOCALE_ID),
  );
  protected readonly expenseStatus: typeof ExpenseStatus = ExpenseStatus;
  private readonly budgetApiMockService: BudgetApiMockService = inject(BudgetApiMockService);
  private readonly dialogRef = inject(MatDialogRef<DialogChangeExpenseStatusComponent, undefined>);
  private readonly destroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.setExpenseStatusToSet();
  }

  protected close(res?: Budget): void {
    this.dialogRef.close(res);
  }

  protected setPaidStatus(): void {
    this.dateOfPaymentControl.markAsTouched();
    if (this.dateOfPaymentControl.valid) {
      this.budgetApiMockService
        .changeExpense({
          ...this.dialogData.expense,
          status: this.statusToSet,
          dateOfPayment: this.dateOfPaymentControl.value!,
        })
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          tap((res) => this.close(res)),
        )
        .subscribe();
    }
  }

  protected setUnpaidStatus(): void {
    this.budgetApiMockService
      .changeExpense({
        ...this.dialogData.expense,
        status: this.statusToSet,
        dateOfPayment: undefined,
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res) => this.close(res)),
      )
      .subscribe();
  }

  private setExpenseStatusToSet(): void {
    this.statusToSet =
      this.dialogData.expense?.status === ExpenseStatus.NonPaid
        ? ExpenseStatus.Paid
        : ExpenseStatus.NonPaid;
  }
}
