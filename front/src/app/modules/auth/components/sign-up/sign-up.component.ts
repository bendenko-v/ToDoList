import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Router } from '@angular/router';
import { FormValidatorService } from "../../../../services/form-validator.service";
import { UserService } from "../../../../services/user.service";
import { getErrors, setErrorToForm } from "../../../shared/helpers/form";
import { BehaviorSubject, finalize } from "rxjs";

@UntilDestroy()
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormValidatorService],
})
export class SignUpComponent {
  isLoading$ = new BehaviorSubject<boolean>(false);
  form = this.fb.group({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_repeat: '',
  });

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private formValidatorService: FormValidatorService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {
  }

  onSend(): void {
    this.snackBar.dismiss();
    this.isLoading$.next(true);
    this.userService.signUp(this.form.getRawValue())
      .pipe(
        finalize(() => this.isLoading$.next(false)),
        untilDestroyed(this)
      )
      .subscribe(res => {
        this.router.navigateByUrl('/');
        this.snackBar.open('Успешная авторизация', 'Закрыть', {
          duration: 2000
        });
      }, http => {
        const errors = getErrors(http);
        setErrorToForm(this.form, errors.apiErrors);

        errors.nonFieldErrors.forEach(error => {
          this.snackBar.open(error, 'Закрыть');
        });

        this.formValidatorService.update();
      });
  }

}
