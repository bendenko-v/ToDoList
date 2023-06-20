import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { CategoriesRequest, Category, CategoryRequest, CategoryWithDetails } from "../models/categories";
import { environment } from "../../environments/environment";
import { ResultPage } from "../models/page";
import { prepareHttpParams } from "../modules/shared/helpers/http";

@Injectable({
  providedIn: 'root'
})
export class CategoryApiService {

  constructor(
    private httpClient: HttpClient,
  ) {
  }

  loadCategory(id: number): Observable<Category> {
    return this.httpClient.get<Category>(environment.apiEndpoint + 'goals/goal_category/' + id);
  }

  createCategory(form: CategoryRequest): Observable<Category> {
    return this.httpClient.post<Category>(environment.apiEndpoint + 'goals/goal_category/create', form);
  }

  updateCategory(form: CategoryRequest, id: number): Observable<Category> {
    return this.httpClient.put<Category>(environment.apiEndpoint + 'goals/goal_category/' + id, form);
  }

  deleteCategory(id: number): Observable<void> {
    return this.httpClient.delete<void>(environment.apiEndpoint + 'goals/goal_category/' + id);
  }

  loadCategories(request: CategoriesRequest): Observable<ResultPage<CategoryWithDetails>> {
    return this.httpClient.get<ResultPage<CategoryWithDetails>>(environment.apiEndpoint + 'goals/goal_category/list', {
      params: prepareHttpParams(request),
      withCredentials: true,
    })
  }

  loadAllList(): Observable<CategoryWithDetails[]> {
    return this.httpClient.get<CategoryWithDetails[]>(environment.apiEndpoint + 'goals/goal_category/list', {
      withCredentials: true,
    })
  }
}
