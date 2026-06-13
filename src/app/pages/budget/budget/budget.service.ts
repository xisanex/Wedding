import { inject, Injectable } from '@angular/core';
import { BudgetApiMockService } from '../budget-api-mock.service';
import { Observable, tap } from 'rxjs';
import { Budget, BudgetBalance, CategoryDetails, Expense } from '../types/expense.types';
import { MatTableDataSource } from '@angular/material/table';

@Injectable()
export class BudgetService {
  private readonly budgetApiMockService: BudgetApiMockService = inject(BudgetApiMockService);

  private _budget?: Budget;
  private _expenseCategories: string[] = [];

  private readonly _expenseDataSource: MatTableDataSource<Expense> =
    new MatTableDataSource<Expense>();

  public get expenses(): Expense[] {
    return this._budget?.expenses ?? [];
  }

  public get categoriesDetails(): CategoryDetails[] {
    return this._budget?.categoriesDetails ?? [];
  }

  public get budgetBalance(): BudgetBalance | undefined {
    return this._budget?.budgetBalance;
  }

  public get expenseCategories(): string[] {
    return this._expenseCategories;
  }

  public get expenseDataSource(): MatTableDataSource<Expense> {
    return this._expenseDataSource;
  }

  public set budget(budget: Budget) {
    this._budget = budget;
    this._expenseDataSource.data = this.expenses;
  }

  public downloadBudget(): Observable<Budget> {
    return this.budgetApiMockService.getBudget().pipe(
      tap((budget) => {
        this.budget = budget;
        this._expenseCategories = budget.categoriesDetails?.map((category) => category.name) ?? [];
      }),
    );
  }
}
