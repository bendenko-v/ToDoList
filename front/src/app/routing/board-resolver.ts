import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { Category } from "../models/categories";
import { catchError, Observable, of } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BoardDetails } from "../models/board";
import { CurrentBoardService } from "../services/current-board.service";

@Injectable({ providedIn: 'root' })
export class BoardResolver implements Resolve<BoardDetails | null> {
  constructor(
    private currentBoardService: CurrentBoardService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
  }

  resolve(
    route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<BoardDetails | null> {
    const id = route.paramMap.get('boardId');

    return id ? this.setBoard(id) : this.clearBoard();
  }

  private setBoard(id: string): Observable<BoardDetails | null> {
    return this.currentBoardService.setBoard(
      parseInt(id)
    ).pipe(
      catchError(() => {
        this.router.navigateByUrl('/');

        this.snackBar.open('Категория ' + id + ' не найдена!', 'Закрыть', {
          duration: 2000
        })

        return of(null);
      })
    );
  }

  private clearBoard(): Observable<null> {
    this.currentBoardService.clearBoard();
    return of(null);
  }
}
