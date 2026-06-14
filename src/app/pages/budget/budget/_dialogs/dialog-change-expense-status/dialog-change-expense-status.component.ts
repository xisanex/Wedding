import { Component, DestroyRef, inject, OnInit } from '@angular/core';
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
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BudgetApiMockService } from '../../../budget-api-mock.service';
import { GlobalConfig } from '../../../../../core/global-config/global-config.class';

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
  protected readonly dialogData: ChangeExpenseStatusDialogData = inject(MAT_DIALOG_DATA);
  protected statusToSet!: ExpenseStatus;
  protected readonly dateOfPaymentControl: FormControl<Date | null> = new FormControl(new Date(), [
    Validators.required,
  ]);
  protected readonly expenseStatus: typeof ExpenseStatus = ExpenseStatus;
  private readonly budgetApiMockService: BudgetApiMockService = inject(BudgetApiMockService);
  private readonly dialogRef: MatDialogRef<DialogChangeExpenseStatusComponent, Budget> =
    inject(MatDialogRef);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

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
        .addOrChangeExpense({
          ...this.dialogData.expense,
          status: this.statusToSet,
          dateOfPayment: GlobalConfig.saveDateToAPI(this.dateOfPaymentControl.value!),
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
      .addOrChangeExpense({
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
