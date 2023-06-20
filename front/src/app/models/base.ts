export interface Entity<IdType = number | string> {
  id: IdType;
  title: string;
  isBlocked?: boolean;
}
