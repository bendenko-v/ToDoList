import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { FormValidatorService } from "../../../../services/form-validator.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Board, BoardDetails } from "../../../../models/board";
import { BehaviorSubject, finalize, map, Observable } from "rxjs";
import { BoardsService } from "../../../../services/boards.service";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { ParticipantRole } from "../../../../models/user";

@UntilDestroy()
@Component({
  selector: 'app-board-edit',
  templateUrl: './board-edit.component.html',
  styleUrls: ['./board-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormValidatorService],
})
export class BoardEditComponent implements OnInit {
  isLoading$ = new BehaviorSubject(false);
  form = new FormGroup({
    title: new FormControl(''),
    participants: new FormControl([])
  });

  constructor(
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<undefined>,
    private boardService: BoardsService,
    private formValidatorService: FormValidatorService,
    @Inject(MAT_DIALOG_DATA) public board?: BoardDetails
  ) {
  }

  ngOnInit(): void {
    if (this.board) {
      const data = {
        ...this.board,
        participants: this.board?.participants.filter(it => it.role !== ParticipantRole.creator) || [],
      };
      this.form.patchValue(data);
    }
  }

  save(): void {
    this.isLoading$.next(true);
    (this.board?.id ? this.update() : this.create()).pipe(
      finalize(() => this.isLoading$.next(false)),
      untilDestroyed(this),
    ).subscribe(message => {
      this.snackBar.open(message, undefined, {
        duration: 2000,
      });
      this.dialogRef.close();
    }, http => {
      this.formValidatorService.setErrors(http, this.form);
    })
  }

  private create(): Observable<string> {
    return this.boardService.create(this.form.getRawValue()).pipe(
      map(() => 'Доска создана')
    );
  }

  private update(): Observable<string> {
    return this.boardService.update(this.form.getRawValue(), this.board!.id).pipe(
      map(() => 'Доска сохранена')
    );
  }

}
