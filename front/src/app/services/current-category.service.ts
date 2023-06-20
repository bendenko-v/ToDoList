import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, Observable, of, shareReplay, switchMap, take } from "rxjs";
import { Category } from "../models/categories";
import { CategoryApiService } from "./category-api.service";

@Injectable({
  providedIn: 'root'
})
export class CurrentCategoryService {
  private categoryId$ = new BehaviorSubject<number | null>(null);

  category$: Observable<Category | null>;

  constructor(
    private goalsApiService: CategoryApiService,
  ) {
    this.category$ = this.categoryId$.pipe(
      switchMap(id => !id ? of(null) : this.goalsApiService.loadCategory(id)),
      shareReplay({ refCount: false, bufferSize: 1 }),
    );
  }

  setCategory(id: number): Observable<Category> {
    this.categoryId$.next(id);
    return this.category$.pipe(
      // @ts-ignore
      filter(item => item?.id === id),
      take(1),
    ) as Observable<Category>;
  }

  clearCategory(): void {
    return this.categoryId$.next(null);
  }
}
