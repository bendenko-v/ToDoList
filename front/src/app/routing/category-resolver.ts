import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { Category } from "../models/categories";
import { catchError, Observable, of } from "rxjs";
import { CurrentCategoryService } from "../services/current-category.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({ providedIn: 'root' })
export class CategoryResolver implements Resolve<Category | null> {
  constructor(
    private currentCategoryService: CurrentCategoryService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
  }

  resolve(
    route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<Category | null> {
    const catId = route.paramMap.get('categoryId');

    return catId ? this.setCategory(catId) : this.clearCategory();
  }

  private setCategory(catId: string): Observable<Category | null> {
    return this.currentCategoryService.setCategory(
      parseInt(catId)
    ).pipe(
      catchError(() => {
        this.router.navigateByUrl('/');

        this.snackBar.open('Категория ' + catId + ' не найдена!', 'Закрыть', {
          duration: 2000
        })

        return of(null);
      })
    );
  }

  private clearCategory(): Observable<null> {
    this.currentCategoryService.clearCategory();
    return of(null);
  }
}
