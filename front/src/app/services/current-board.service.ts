import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, Observable, of, shareReplay, switchMap, take } from "rxjs";
import { BoardDetails } from "../models/board";
import { BoardsService } from "./boards.service";

@Injectable({
  providedIn: 'root'
})
export class CurrentBoardService {
  private boardId$ = new BehaviorSubject<number | null>(null);

  board$: Observable<BoardDetails | null>;

  constructor(
    private boardsService: BoardsService,
  ) {
    this.board$ = this.boardId$.pipe(
      switchMap(id => !id ? of(null) : this.boardsService.loadDetail(id)),
      shareReplay({ refCount: false, bufferSize: 1 }),
    );
  }

  setBoard(id: number): Observable<BoardDetails> {
    this.boardId$.next(id);
    return this.board$.pipe(
      // @ts-ignore
      filter(item => item?.id === id),
      take(1),
    ) as Observable<BoardDetails>;
  }

  clearBoard(): void {
    return this.boardId$.next(null);
  }
}
