export interface Expense {
  id: string;
  category: string;
  name: string;
  cost: string;
  paymentDeadline: string;
  dateOfPayment?: string;
  status: ExpenseStatus;
}

export interface PercentageAndValue {
  value: string;
  percentage: string;
}

export enum ExpenseStatus {
  Paid = 'Paid',
  NonPaid = 'NonPaid',
}

export interface CategoryDetails {
  id: string;
  name: string;
  percentage: string;
  cost: string;
}

export interface BudgetBalance {
  total: string;
  spent: PercentageAndValue;
  remain: PercentageAndValue;
}

export interface Budget {
  id?: string;
  budgetBalance?: BudgetBalance;
  expenses?: Expense[];
  categoriesDetails?: CategoryDetails[];
}
