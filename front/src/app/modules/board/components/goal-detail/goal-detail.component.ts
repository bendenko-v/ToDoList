import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { GoalWithDetails } from "../../../../models/goal";
import { CategoriesService } from "../../../../services/categories.service";
import { BehaviorSubject, catchError, combineLatest, finalize, map, Observable, shareReplay, take, tap } from "rxjs";
import { GoalsService } from "../../../../services/goals.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormValidatorService } from "../../../../services/form-validator.service";
import { FormControl } from "@angular/forms";
import { CommentsService } from "../../../../services/comments.service";
import { getErrors, setErrorToControl } from "../../../shared/helpers/form";
import { DataSource } from "../../../../services/data-source";
import { DataSourceQuery, ResultPage } from "../../../../models/page";
import { CommentDTO } from "../../../../models/comment";
import { Entity } from "../../../../models/base";
import { UserService } from "../../../../services/user.service";

@Component({
  selector: 'app-goal-detail',
  templateUrl: './goal-detail.component.html',
  styleUrls: ['./goal-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormValidatorService],
})
export class GoalDetailComponent implements OnInit {
  goal$: Observable<GoalWithDetails>;
  user$ = this.userService.user$;
  commentControl = new FormControl('');
  dataSource?: DataSource<CommentDTO>;
  commentList$: Observable<CommentDTO[]>;
  isLoadingComment$: Observable<boolean>;
  commentOrderFields: Entity[] = [
    { id: '', title: 'Сначала новые' },
    { id: 'created', title: 'Сначала старые' },
    { id: 'updated', title: 'Недавно изменённые' }
  ];

  private isLoadingAddComment$ = new BehaviorSubject<boolean>(false);

  constructor(
    @Inject(MAT_DIALOG_DATA) private goalId: number,
    private categoriesService: CategoriesService,
    private goalsService: GoalsService,
    private dialogRef: MatDialogRef<undefined>,
    private snackBar: MatSnackBar,
    private commentsService: CommentsService,
    private formValidatorService: FormValidatorService,
    private userService: UserService,
  ) {
    this.goal$ = this.goalsService.loadGoal(this.goalId).pipe(
      shareReplay({ refCount: true, bufferSize: 1 }),
      catchError((error) => {
        this.snackBar.open('Цель не найдена', 'Закрыть', {
          duration: 2000,
        });

        this.dialogRef.close();

        throw Error(error);
      }),
    );
  }

  ngOnInit(): void {
    this.dataSource = new DataSource(
      {},
      this.loadGoals.bind(this),
      this.commentsService.refresh$,
    );
    this.commentList$ = this.dataSource.list$;
    this.isLoadingComment$ = combineLatest([
      this.isLoadingAddComment$,
      this.dataSource.isLoading$
    ]).pipe(map(([isAdd, isLoad]) => isAdd || isLoad))
  }

  addComment(): void {
    this.isLoadingAddComment$.next(true);
    this.commentsService.addComment({
      text: this.commentControl.value,
      goal: this.goalId,
    }).pipe(
      finalize(() => this.isLoadingAddComment$.next(false)),
    ).subscribe(() => {
      this.snackBar.open('Комментарий добавлен', 'Закрыть', {
        duration: 2000
      });
      this.commentControl.patchValue('');
    }, http => {
      const errors = getErrors(http, ['text']);

      if (errors.apiErrors?.text) {
        setErrorToControl(this.commentControl, errors.apiErrors.text);
      }

      errors.nonFieldErrors.forEach(error => {
        this.snackBar.open(error, 'Закрыть');
      });

      this.formValidatorService.update();
    })
  }

  onCommentDelete(comment: CommentDTO): void {
    this.isLoadingAddComment$.next(true);
    this.commentsService.deleteComment(comment.id).pipe(
      finalize(() => this.isLoadingAddComment$.next(false)),
    ).subscribe(() => {
      this.snackBar.open('Комментарий удалён', 'Закрыть', {
        duration: 2000
      });
    }, http => {
      const errors = getErrors(http);

      errors.nonFieldErrors.forEach(error => {
        this.snackBar.open(error, 'Закрыть');
      });
    })
  }

  onDelete(): void {
    this.dialogRef.close({
      action: 'delete',
      id: this.goalId
    });
  }

  onEdit(): void {
    this.goal$.pipe(
      take(1)
    ).subscribe(goal => {
      this.dialogRef.close({
        action: 'edit',
        goal: {
          ...goal,
          status: goal.status.id,
          priority: goal.priority.id,
          category: goal.category.id,
        }
      });
    })

  }

  private loadGoals(query: DataSourceQuery): Observable<ResultPage<CommentDTO>> {
    return this.commentsService.loadList({
      ...query,
      ordering: query.orderField,
      goal: this.goalId,
    })
  }
}
