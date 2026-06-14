import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Budget, Expense, ExpenseStatus } from '../../../types/expense.types';
import { ExpenseStatusPipe } from '../../../pipes/expense-status.pipe';
import { BudgetApiMockService } from '../../../budget-api-mock.service';
import { GlobalConfig } from '../../../../../core/global-config/global-config.class';

interface AddEditExpenseFormGroup {
  name: FormControl<string | null>;
  category: FormControl<string | null>;
  cost: FormControl<string | null>;
  status: FormControl<ExpenseStatus | null>;
  paymentDeadline: FormControl<Date | null>;
  dateOfPayment: FormControl<Date | null>;
}

export interface AddEditExpenseDialogData {
  title: string;
  expense?: Expense;
  expenseCategories: string[];
}

@Component({
  selector: 'app-dialog-add-edit-expense',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatButtonModule,
    ExpenseStatusPipe,
  ],
  templateUrl: './dialog-add-edit-expense.component.html',
  styleUrl: './dialog-add-edit-expense.component.scss',
})
export class DialogAddEditExpenseComponent implements OnInit {
  protected readonly dialogData: AddEditExpenseDialogData = inject(MAT_DIALOG_DATA);
  protected readonly expenseStatusOptions: ExpenseStatus[] = [
    ExpenseStatus.NonPaid,
    ExpenseStatus.Paid,
  ];

  private readonly budgetApiMockService: BudgetApiMockService = inject(BudgetApiMockService);
  private readonly dialogRef: MatDialogRef<DialogAddEditExpenseComponent, Budget> =
    inject(MatDialogRef);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  protected readonly form: FormGroup<AddEditExpenseFormGroup> =
    new FormGroup<AddEditExpenseFormGroup>({
      name: new FormControl(null, [Validators.required]),
      category: new FormControl(null, [Validators.required]),
      cost: new FormControl(null, [Validators.required]),
      status: new FormControl(null, [Validators.required]),
      paymentDeadline: new FormControl(null, [Validators.required]),
      dateOfPayment: new FormControl({
        value: null,
        disabled: this.dialogData.expense?.status !== ExpenseStatus.Paid,
      }),
    });

  public ngOnInit(): void {
    if (this.dialogData.expense) {
      const expense: Expense = this.dialogData.expense;
      this.form.setValue({
        name: expense.name,
        category: expense.category,
        cost: expense.cost,
        status: expense.status,
        paymentDeadline: new Date(expense.paymentDeadline),
        dateOfPayment: expense.dateOfPayment ? new Date(expense.dateOfPayment) : null,
      });
    }
    this.listenOnStatusChange();
  }

  protected close(budget?: Budget): void {
    this.dialogRef.close(budget);
  }

  protected addOrEditExpense(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.budgetApiMockService
      .addOrChangeExpense({
        ...(this.dialogData.expense?.id ? { id: this.dialogData.expense.id } : {}),
        name: this.form.controls.name.value!,
        category: this.form.controls.category.value!,
        cost: this.form.controls.cost.value!,
        status: this.form.controls.status.value!,
        paymentDeadline: GlobalConfig.saveDateToAPI(this.form.controls.paymentDeadline.value!),
        dateOfPayment: this.form.controls.dateOfPayment.value
          ? GlobalConfig.saveDateToAPI(this.form.controls.dateOfPayment.value)
          : undefined,
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res) => this.close(res)),
      )
      .subscribe();
  }

  private listenOnStatusChange(): void {
    const dateOfPaymentControl: FormControl<Date | null> = this.form.controls.dateOfPayment;
    this.form.controls.status.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((status) => {
          if (status === ExpenseStatus.Paid) {
            dateOfPaymentControl.enable();
            dateOfPaymentControl.addValidators(Validators.required);
          } else {
            dateOfPaymentControl.reset();
            dateOfPaymentControl.disable();
            dateOfPaymentControl.removeValidators(Validators.required);
          }
          dateOfPaymentControl.updateValueAndValidity();
        }),
      )
      .subscribe();
  }
}
