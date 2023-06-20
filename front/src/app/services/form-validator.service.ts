import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MatSnackBar } from "@angular/material/snack-bar";
import { HttpErrorResponse } from "@angular/common/http";
import { FormGroup } from "@angular/forms";
import { getErrors, setErrorToForm } from "../modules/shared/helpers/form";

@Injectable()
export class FormValidatorService {
  update$ = new Subject<void>();

  constructor(
    private snackBar: MatSnackBar,
  ) {
  }

  update(): void {
    this.update$.next();
  }

  setErrors(httpError: HttpErrorResponse, form: FormGroup): void {
    const errors = getErrors(httpError);
    setErrorToForm(form, errors.apiErrors);

    errors.nonFieldErrors.forEach(error => {
      this.snackBar.open(error, 'Закрыть');
    });

    this.update();
  }
}
