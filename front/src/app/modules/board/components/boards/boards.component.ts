import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { DataSource } from "../../../../services/data-source";
import { Board } from "../../../../models/board";
import { BoardsService } from "../../../../services/boards.service";
import { DataSourceQuery, ResultPage } from "../../../../models/page";
import { MatDialog } from "@angular/material/dialog";
import { BoardEditComponent } from "../board-edit/board-edit.component";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { MatSnackBar } from "@angular/material/snack-bar";
import { getErrors } from "../../../shared/helpers/form";

@UntilDestroy()
@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'created', 'open', 'openCategories', 'edit', 'delete'];
  isLoading$: Observable<boolean>;
  dataSource: DataSource<Board>;

  constructor(
    private boardsService: BoardsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.dataSource = new DataSource<Board, {}>({},
      this.loadBoards.bind(this),
      this.boardsService.reload$,
    );
    this.isLoading$ = this.dataSource.isLoading$;
  }

  loadBoards(query: DataSourceQuery): Observable<ResultPage<Board>> {
    return this.boardsService.loadList({
      limit: query.limit,
      offset: query.offset,
    })
  }

  addBoard(): void {
    this.dialog.open(BoardEditComponent)
  }

  editBoard(board: Board): void {
    this.boardsService.loadDetail(board.id).pipe(
      untilDestroyed(this),
    ).subscribe(detail => {
      this.dialog.open(BoardEditComponent, {
        data: detail
      });
    });
  }

  deleteBoard(board: Board): void {
    this.boardsService.delete(board.id).pipe(
      untilDestroyed(this),
    ).subscribe(() => {
      this.snackBar.open('Доска удалена', 'Закрыть', {
        duration: 2000
      });
    }, httpError => {
      const errors = getErrors(httpError);
      errors.nonFieldErrors.forEach(error => {
        this.snackBar.open(error, 'Закрыть');
      });
    });
  }

}
