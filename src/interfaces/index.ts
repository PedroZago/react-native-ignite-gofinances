export type TypeCard = 'income' | 'expense' | 'total';

export interface CategoryData {
  key: string;
  name: string;
  icon: string;
  color: string;
}

export interface TransactionData {
  id: string;
  name: string;
  amount: string;
  date: string;
  category: string;
  type: 'income' | 'expense';
}
