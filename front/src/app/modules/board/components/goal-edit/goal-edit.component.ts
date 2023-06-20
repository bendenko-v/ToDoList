import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder } from "@angular/forms";
import { FormValidatorService } from "../../../../services/form-validator.service";
import { Goal, GOAL_STATUS_LIST, GoalData, PRIORITY_STATUS_LIST } from "../../../../models/goal";
import { BehaviorSubject, finalize, map, Observable } from "rxjs";
import { GoalsService } from "../../../../services/goals.service";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { MatSnackBar } from "@angular/material/snack-bar";
import { prepareDate } from "../../../shared/helpers/form";
import { CategoriesService } from "../../../../services/categories.service";
import { Category } from "../../../../models/categories";
import { Entity } from "../../../../models/base";

@UntilDestroy()
@Component({
  selector: 'app-goal-edit',
  templateUrl: './goal-edit.component.html',
  styleUrls: ['./goal-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormValidatorService],
})
export class GoalEditComponent implements OnInit {
  isLoading$ = new BehaviorSubject<boolean>(false);
  statusList = GOAL_STATUS_LIST;
  priorityList = PRIORITY_STATUS_LIST;
  categories$: Observable<Entity[]>;
  form = this.fb.group({
    title: '',
    description: '',
    category: '',
    status: '',
    due_date: '',
    priority: 1,
  });

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: {
      goal: Partial<Goal>,
      boardId: number,
    },
    private goalsService: GoalsService,
    private formValidatorService: FormValidatorService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<undefined>,
    private categoriesService: CategoriesService,
  ) {
  }

  ngOnInit(): void {
    this.form.patchValue(this.data.goal);
    this.categories$ = this.categoriesService.allList$.pipe(
      map(list => list.map(item => ({
        ...item,
        isBlocked: !!this.data.boardId && item.board !== this.data.boardId
      })))
    );
  }

  save(): void {
    this.isLoading$.next(true);
    const due_date = this.form.getRawValue().due_date;
    const form = {
      ...this.form.getRawValue(),
      due_date: prepareDate(due_date),
    };

    (this.data.goal?.id ? this.updateGoal(form) : this.addGoal(form)).pipe(
      finalize(() => this.isLoading$.next(false)),
      untilDestroyed(this),
    ).subscribe(() => {
      this.snackBar.open('Цель сохранена', 'Закрыть', {
        duration: 2000
      });
      this.dialogRef.close();
    }, http => {
      this.formValidatorService.setErrors(http, this.form);
    })
  }

  private addGoal(goal: GoalData): Observable<Goal> {
    return this.goalsService.createGoal(goal);
  }

  private updateGoal(goal: GoalData): Observable<Goal> {
    return this.goalsService.updateGoal(goal, this.data.goal.id!);
  }

}
