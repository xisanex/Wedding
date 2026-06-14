import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  Budget,
  BudgetBalance,
  CategoryDetails,
  Expense,
  ExpenseStatus,
} from './types/expense.types';

export interface ChangeExpense {
  id?: string;
  category: string;
  name: string;
  cost: string;
  paymentDeadline: string;
  dateOfPayment?: string;
  status: ExpenseStatus;
}

@Injectable({ providedIn: 'root' })
export class BudgetApiMockService {
  private readonly budgetBalance: BudgetBalance = {
    total: '110000',
    remain: {
      value: '34000',
      percentage: '31',
    },
    spent: {
      value: '76000',
      percentage: '69',
    },
  };

  private readonly categoriesDetails: CategoryDetails[] = [
    {
      id: '1',
      name: 'Sala',
      percentage: '20',
      cost: '15000',
    },
    {
      id: '2',
      name: 'Fotograf i kamerzysta',
      percentage: '20',
      cost: '15000',
    },
    {
      id: '3',
      name: 'Dekoracje',
      percentage: '20',
      cost: '15000',
    },
    {
      id: '4',
      name: 'Ubiór',
      percentage: '20',
      cost: '15000',
    },
    {
      id: '5',
      name: 'Muzyka',
      percentage: '10',
      cost: '7500',
    },
    {
      id: '6',
      name: 'Inne',
      percentage: '10',
      cost: '7500',
    },
  ];

  private readonly expenses: Expense[] = [
    {
      id: '1',
      category: 'Sala',
      name: 'Talerzyk',
      cost: '50000',
      paymentDeadline: '2025-01-01',
      dateOfPayment: '2025-02-02',
      status: ExpenseStatus.Paid,
    },
    {
      id: '2',
      category: 'Fotograf i kamerzysta',
      name: 'Cośtam',
      cost: '10000',
      paymentDeadline: '2025-01-01',
      dateOfPayment: '2025-02-02',
      status: ExpenseStatus.Paid,
    },
    {
      id: '3',
      category: 'Dekoracje',
      name: 'Filodendron',
      cost: '5000',
      paymentDeadline: '2025-01-01',
      status: ExpenseStatus.NonPaid,
    },
    {
      id: '4',
      category: 'Ubiór',
      name: 'Garniak',
      cost: '2900',
      paymentDeadline: '2025-01-01',
      dateOfPayment: '2025-02-02',
      status: ExpenseStatus.Paid,
    },
    {
      id: '5',
      category: 'Muzyka',
      name: 'DJ',
      cost: '19900',
      paymentDeadline: '2025-01-01',
      dateOfPayment: '2025-02-02',
      status: ExpenseStatus.Paid,
    },
    {
      id: '6',
      category: 'Inne',
      name: 'Jakieś gówno',
      cost: '100000',
      paymentDeadline: '2025-01-01',
      dateOfPayment: '2025-02-02',
      status: ExpenseStatus.Paid,
    },
  ];

  public getBudget(): Observable<Budget> {
    return of({
      id: '1',
      budgetBalance: this.budgetBalance,
      categoriesDetails: this.categoriesDetails,
      expenses: this.expenses,
    });
  }

  public addOrChangeExpense(expense: ChangeExpense): Observable<Budget> {
    if (expense.id) {
      const fountIndex: number = this.expenses.findIndex((item) => item.id === expense.id);
      this.expenses[fountIndex] = expense as Expense;
    } else {
      this.expenses.push({ ...expense, id: (this.expenses.length + 1).toString() });
    }
    return this.getBudget();
  }

  public deleteExpense(id: string): Observable<Budget> {
    const fountIndex: number = this.expenses.findIndex((expense) => expense.id === id);
    this.expenses.splice(fountIndex, 1);
    return this.getBudget();
  }
}
