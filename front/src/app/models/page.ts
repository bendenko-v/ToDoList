export interface ResultPage<T> {
  count: number;
  next: string | null;
  previous: null;
  results: T[];
}

export interface ListQuery {
  limit: number;
  offset: number;
}

export interface DataSourceQuery<Form = {}> {
  search: Form;
  offset: number;
  limit: number;
  orderField: string;
}
