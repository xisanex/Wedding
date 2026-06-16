import { Routes } from '@angular/router';
import { BudgetComponent } from './budget/budget.component';
import { AddEditBudgetComponent } from './add-edit-budget/add-edit-budget.component';

export const budgetRoutes: Routes = [
  {
    path: '',
    loadComponent: () => BudgetComponent,
  },
  {
    path: 'edit/:id',
    loadComponent: () => AddEditBudgetComponent,
  },
  {
    path: 'add',
    loadComponent: () => AddEditBudgetComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
