export interface QALabConfig {
  baseUrl: string;
  headless: boolean;
  slowMo: number;
}

export type AsyncButtonState = 'default' | 'loading' | 'success' | 'error';

export interface TableRow {
  id: string;
  name: string;
  email: string;
  status: 'Active' | 'Inactive';
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface RegistrationForm {
  fullName: string;
  email: string;
  age: number;
  phone: string;
}

export interface DragItem {
  label: string;
  index: number;
}
