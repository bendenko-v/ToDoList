import { Injectable } from '@angular/core';
import { CategoryApiService } from "./category-api.service";
import { Observable, shareReplay, startWith, Subject, switchMap, tap } from "rxjs";
import { CategoriesRequest, Category, CategoryRequest, CategoryWithDetails } from "../models/categories";
import { ResultPage } from "../models/page";

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  reload$ = new Subject<void>();
  allList$: Observable<Category[]>;

  constructor(
    private categoryApiService: CategoryApiService,
  ) {
    this.allList$ = this.reload$.pipe(
      startWith(undefined),
      switchMap(() => this.categoryApiService.loadAllList()),
      shareReplay({ refCount: false, bufferSize: 1 }),
    )
  }

  createCategory(form: CategoryRequest): Observable<Category> {
    return this.categoryApiService.createCategory(form).pipe(
      tap(() => this.reload$.next())
    );
  }

  updateCategory(form: CategoryRequest, id: number): Observable<Category> {
    return this.categoryApiService.updateCategory(form, id).pipe(
      tap(() => this.reload$.next())
    );
  }

  deleteCategory(id: number): Observable<void> {
    return this.categoryApiService.deleteCategory(id).pipe(
      tap(() => this.reload$.next())
    );
  }

  loadCategories(request: CategoriesRequest): Observable<ResultPage<CategoryWithDetails>> {
    return this.categoryApiService.loadCategories(request);
  }

  loadCategory(id: number): Observable<Category> {
    return this.categoryApiService.loadCategory(id);
  }
}
