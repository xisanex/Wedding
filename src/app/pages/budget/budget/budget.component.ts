import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterLink } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { BackgroundColorDirective } from '../../../shared/directives/background-color.directive';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import {
  AddEditExpenseDialogData,
  DialogAddEditExpenseComponent,
} from './_dialogs/dialog-add-edit-expense/dialog-add-edit-expense.component';
import { Budget, Expense, ExpenseStatus } from '../types/expense.types';
import {
  DeleteExpenseConfirmationDialogData,
  DialogDeleteExpenseConfirmationComponent,
} from './_dialogs/dialog-delete-expense-confirmation/dialog-delete-expense-confirmation.component';
import { DefaultValuePipe } from '../../../shared/pipes/default-value.pipe';
import { ExpenseStatusPipe } from '../pipes/expense-status.pipe';
import {
  ChangeExpenseStatusDialogData,
  DialogChangeExpenseStatusComponent,
} from './_dialogs/dialog-change-expense-status/dialog-change-expense-status.component';
import { BudgetService } from './budget.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, tap } from 'rxjs';

@Component({
  selector: 'app-budget',
  imports: [
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MatCardModule,
    MatProgressBarModule,
    BackgroundColorDirective,
    MatTableModule,
    DefaultValuePipe,
    ExpenseStatusPipe,
  ],
  templateUrl: './budget.component.html',
  providers: [BudgetService],
  styleUrl: './budget.component.scss',
})
export class BudgetComponent implements OnInit {
  protected readonly budgetService: BudgetService = inject(BudgetService);
  protected readonly expenseDisplayedColumns: string[] = [
    'category',
    'name',
    'cost',
    'paymentDates',
    'status',
    'actions',
  ];
  protected readonly categoriesDetailsDisplayedColumns: string[] = [
    'color',
    'name',
    'percentage',
    'cost',
  ];

  protected readonly expenseStatus: typeof ExpenseStatus = ExpenseStatus;
  protected readonly colors: string[] = [
    '#36A2EB',
    '#FF6384',
    '#4BC0C0',
    '#FF9F40',
    '#9966FF',
    '#FFCD56',
    '#C9CBCF',
    '#26D0CE',
    '#7ED957',
    '#5B8DEF',
    '#C77DFF',
    '#FF7AA2',
    '#FFB86B',
    '#FFD166',
    '#6C757D',
  ];

  private readonly matDialog: MatDialog = inject(MatDialog);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    Chart.register(...registerables);
    this.getBudget();
  }

  protected openDialogAddExpense(): void {
    this.matDialog
      .open<DialogAddEditExpenseComponent, AddEditExpenseDialogData, Budget>(
        DialogAddEditExpenseComponent,
        {
          width: '560px',
          disableClose: true,
          data: {
            title: 'Dodaj wydatek',
            expenseCategories: this.budgetService.expenseCategories,
          },
        },
      )
      .afterClosed()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((budget) => !!budget),
        tap((budget) => this.saveBudgetToService(budget)),
      )
      .subscribe();
  }

  protected openDialogEditExpense(expense: Expense): void {
    this.matDialog
      .open<DialogAddEditExpenseComponent, AddEditExpenseDialogData, Budget>(
        DialogAddEditExpenseComponent,
        {
          width: '560px',
          disableClose: true,
          autoFocus: false,
          data: {
            title: 'Edytuj wydatek',
            expense,
            expenseCategories: this.budgetService.expenseCategories,
          },
        },
      )
      .afterClosed()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((budget) => !!budget),
        tap((budget) => this.saveBudgetToService(budget)),
      )
      .subscribe();
  }

  protected openDialogDeleteExpenseConfirmation(expense: Expense) {
    this.matDialog
      .open<DialogDeleteExpenseConfirmationComponent, DeleteExpenseConfirmationDialogData, Budget>(
        DialogDeleteExpenseConfirmationComponent,
        {
          width: '560px',
          disableClose: true,
          autoFocus: false,
          data: {
            expense,
          },
        },
      )
      .afterClosed()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((budget) => !!budget),
        tap((budget) => this.saveBudgetToService(budget)),
      )
      .subscribe();
  }

  protected openDialogChangeExpenseStatus(expense: Expense) {
    this.matDialog
      .open<DialogChangeExpenseStatusComponent, ChangeExpenseStatusDialogData, Budget>(
        DialogChangeExpenseStatusComponent,
        {
          width: '560px',
          disableClose: true,
          autoFocus: false,
          data: {
            expense,
          },
        },
      )
      .afterClosed()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((budget) => !!budget),
        tap((budget) => this.saveBudgetToService(budget)),
      )
      .subscribe();
  }

  private saveBudgetToService(budget: Budget) {
    this.budgetService.budget = budget;
    this.setCategoriesChart();
  }

  private getBudget(): void {
    this.budgetService
      .downloadBudget()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => this.setCategoriesChart()),
      )
      .subscribe();
  }

  private setCategoriesChart(): void {
    const chartData: string[] = this.budgetService.categoriesDetails.map(
      (category) => category.percentage,
    );
    const existingChart = Chart.getChart('myChart');
    if (existingChart) {
      existingChart.destroy();
    }

    new Chart('myChart', {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: chartData,
            borderWidth: 1,
            backgroundColor: this.colors,
          },
        ],
      },
      options: {
        events: [],
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }
}
