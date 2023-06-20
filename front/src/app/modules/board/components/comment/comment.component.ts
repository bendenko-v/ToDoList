import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { CommentDTO } from '../../../../models/comment';
import { getInitials } from "../../../shared/helpers/get-initials";
import { FormControl, FormGroup } from "@angular/forms";
import { BehaviorSubject, finalize } from "rxjs";
import { CommentsService } from "../../../../services/comments.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { getErrors, setErrorToForm } from "../../../shared/helpers/form";
import { FormValidatorService } from "../../../../services/form-validator.service";
import { format } from "date-fns";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormValidatorService],
})
export class CommentComponent implements OnChanges {
  @Input() comment: CommentDTO;
  @Input() editAvailable = true;

  @Output() delete = new EventEmitter<void>();

  isLoading$ = new BehaviorSubject<boolean>(false);
  initials: string;
  isEditMode = false;
  form = new FormGroup({
    text: new FormControl(),
    goal: new FormControl(),
  });
  isUpdated = false;

  constructor(
    private commentsService: CommentsService,
    private snackBar: MatSnackBar,
    private formValidatorService: FormValidatorService,
  ) {
  }

  ngOnChanges(): void {
    this.initials = getInitials(this.comment.user);
    this.form.patchValue(this.comment);
    this.isUpdated = this.makeDateStr(this.comment.created) !== this.makeDateStr(this.comment.updated);
  }

  private makeDateStr(date: string): string {
    return format(new Date(date), 'yyyy-MM-dd HH:mm:ss');
  }

  updateComment(): void {
    this.isLoading$.next(true);
    this.commentsService.updateComment(this.form.getRawValue(), this.comment.id).pipe(
      finalize(() => this.isLoading$.next(false)),
    ).subscribe(() => {

    }, http => {
      const errors = getErrors(http);
      setErrorToForm(this.form, errors.apiErrors);

      errors.nonFieldErrors.forEach(error => {
        this.snackBar.open(error, 'Закрыть');
      });

      this.formValidatorService.update();
    })
  }

}
