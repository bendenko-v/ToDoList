import { Injectable } from '@angular/core';
import { CategoryApiService } from "./category-api.service";
import { catchError, combineLatest, map, Observable, of, Subject, switchMap, tap, withLatestFrom } from "rxjs";
import { Goal, GOAL_STATUS_LIST, GoalData, GoalsRequest, GoalWithDetails, PRIORITY_STATUS_LIST } from "../models/goal";
import { GoalsApiService } from "./goals-api.service";
import { ResultPage } from "../models/page";
import { CategoriesService } from "./categories.service";
import { Category } from "../models/categories";

@Injectable({
  providedIn: 'root'
})
export class GoalsService {
  refresh$ = new Subject<void>();

  constructor(
    private goalsApiService: GoalsApiService,
    private categoriesService: CategoriesService,
  ) {
  }

  deleteGoal(id: number): Observable<void> {
    return this.goalsApiService.deleteGoal(id).pipe(
      tap(() => this.refresh$.next())
    );
  }

  createGoal(form: GoalData): Observable<Goal> {
    return this.goalsApiService.createGoal(form).pipe(
      tap(() => this.refresh$.next())
    );
  }

  updateGoal(form: GoalData, id: number, skipRefresh = false): Observable<Goal> {
    return this.goalsApiService.updateGoal(form, id).pipe(
      tap(() => {
        if (!skipRefresh) {
          this.refresh$.next();
        }
      })
    );
  }

  loadGoals(form: GoalsRequest): Observable<ResultPage<Goal>> {
    return this.goalsApiService.loadGoals(form);
  }

  loadGoal(goalId: number): Observable<GoalWithDetails> {
    return this.goalsApiService.loadGoal(goalId).pipe(
      switchMap((goal) => this.categoriesService.loadCategory(goal.category).pipe(
        catchError(() => of({} as Category)),
        map(category => ({ goal, category }))
      )),
      map(({goal, category}) => ({
        ...goal,
        category,
        status: GOAL_STATUS_LIST.find(st => st.id === goal.status)!,
        priority: PRIORITY_STATUS_LIST.find(pr => pr.id === goal.priority)!,
      })),
    );
  }
}
