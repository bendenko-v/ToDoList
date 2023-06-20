import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { DataSource } from "../../../../services/data-source";
import { Entity } from "../../../../models/base";

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginatorComponent<T> {
  @Input() dataSource?: DataSource<T>;
  @Input() limitList = [2, 10, 20, 50];
  @Input() orderFields: Entity[];

  prevPage(): void {
    this.dataSource?.prevPage();
  }

  nextPage(): void {
    this.dataSource?.nextPage();
  }

  setLimit(limit: number): void {
    this.dataSource?.setLimit(limit);
  }

}
