import { Injectable } from '@angular/core';
import { BoardApiService } from "./board-api.service";
import { Board, BoardCreate, BoardDetails } from "../models/board";
import { Observable, shareReplay, startWith, Subject, switchMap, tap } from "rxjs";
import { ListQuery, ResultPage } from "../models/page";

@Injectable({
  providedIn: 'root'
})
export class BoardsService {
  boards$: Observable<Board[]>;
  reload$ = new Subject<void>();

  constructor(
    private boardApiService: BoardApiService,
  ) {
    this.boards$ = this.reload$.pipe(
      startWith(null),
      switchMap(() => this.loadFullList()),
      shareReplay({ refCount: false, bufferSize: 1 }),
    )
  }

  create(form: BoardCreate): Observable<Board> {
    return this.boardApiService.create(form).pipe(
      tap(() => this.reload$.next())
    );
  }

  update(form: BoardDetails, id: number): Observable<BoardDetails> {
    return this.boardApiService.update(form, id).pipe(
      tap(() => this.reload$.next())
    );
  }

  delete(id: number): Observable<void> {
    return this.boardApiService.delete(id).pipe(
      tap(() => this.reload$.next())
    );
  }

  loadFullList(): Observable<Board[]> {
    return this.boardApiService.loadFullList();
  }

  loadList(query: ListQuery): Observable<ResultPage<Board>> {
    return this.boardApiService.loadList(query);
  }

  loadDetail(id: number): Observable<BoardDetails> {
    return this.boardApiService.loadDetail(id);
  }
}
