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

interface AddEditExpenseFormGroup {
  name: FormControl<string | null>;
  category: FormControl<string | null>;
  cost: FormControl<string | null>;
  status: FormControl<ExpenseStatus | null>;
  paymentDeadline: FormControl<string | null>;
  dateOfPayment: FormControl<string | null>;
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
  protected readonly dialogData = inject<AddEditExpenseDialogData>(MAT_DIALOG_DATA);
  protected readonly expenseStatusOptions: ExpenseStatus[] = [
    ExpenseStatus.NonPaid,
    ExpenseStatus.Paid,
  ];

  private readonly budgetApiMockService: BudgetApiMockService = inject(BudgetApiMockService);
  private readonly dialogRef = inject(MatDialogRef<DialogAddEditExpenseComponent, undefined>);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly form: FormGroup<AddEditExpenseFormGroup> =
    new FormGroup<AddEditExpenseFormGroup>({
      name: new FormControl(null, [Validators.required]),
      category: new FormControl(null, [Validators.required]),
      cost: new FormControl(null, [Validators.required]),
      status: new FormControl(null, [Validators.required]),
      paymentDeadline: new FormControl(null, [Validators.required]),
      dateOfPayment: new FormControl(null),
    });

  public ngOnInit(): void {
    if (this.dialogData.expense) {
      const expense: Expense = this.dialogData.expense;
      this.form.setValue({
        name: expense.name,
        category: expense.category,
        cost: expense.cost,
        status: expense.status,
        paymentDeadline: expense.paymentDeadline,
        dateOfPayment: expense.dateOfPayment ?? null,
      });
    }
  }

  protected close(budget?: Budget): void {
    this.dialogRef.close(budget);
  }

  protected addExpense(): void {
    if (this.form.invalid) {
      return;
    }
    this.budgetApiMockService
      .changeExpense({
        name: this.form.controls.name.value!,
        category: this.form.controls.category.value!,
        cost: this.form.controls.cost.value!,
        status: this.form.controls.status.value!,
        paymentDeadline: this.form.controls.paymentDeadline.value!,
        dateOfPayment: this.form.controls.dateOfPayment.value ?? undefined,
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res) => this.close(res)),
      )
      .subscribe();
  }

  protected editExpense(): void {
    this.budgetApiMockService
      .changeExpense({
        id: this.dialogData.expense!.id,
        name: this.form.controls.name.value!,
        category: this.form.controls.category.value!,
        cost: this.form.controls.cost.value!,
        status: this.form.controls.status.value!,
        paymentDeadline: this.form.controls.paymentDeadline.value!,
        dateOfPayment: this.form.controls.dateOfPayment.value ?? undefined,
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res) => this.close(res)),
      )
      .subscribe();
  }
}
