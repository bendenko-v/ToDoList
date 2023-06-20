import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Goal, GoalData, GoalsRequest } from "../models/goal";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { ResultPage } from "../models/page";
import { prepareHttpParams } from "../modules/shared/helpers/http";

@Injectable({
  providedIn: 'root'
})
export class GoalsApiService {

  constructor(
    private httpClient: HttpClient,
  ) {
  }

  deleteGoal(id: number): Observable<void> {
    return this.httpClient.delete<void>(environment.apiEndpoint + 'goals/goal/' + id);
  }

  createGoal(form: GoalData): Observable<Goal> {
    return this.httpClient.post<Goal>(environment.apiEndpoint + 'goals/goal/create', form);
  }

  updateGoal(form: GoalData, id: number): Observable<Goal> {
    return this.httpClient.put<Goal>(environment.apiEndpoint + 'goals/goal/' + id, form);
  }

  loadGoals(form: GoalsRequest): Observable<ResultPage<Goal>> {
    return this.httpClient.get<ResultPage<Goal>>(environment.apiEndpoint + 'goals/goal/list', {
      params: prepareHttpParams(form)
    });
  }

  loadGoal(id: number): Observable<Goal> {
    return this.httpClient.get<Goal>(environment.apiEndpoint + 'goals/goal/' + id, );
  }
}
