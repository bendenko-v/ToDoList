import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FormValidatorService } from "../../../../services/form-validator.service";
import { UserService } from "../../../../services/user.service";
import { getErrors, setErrorToForm } from "../../../shared/helpers/form";
import { BehaviorSubject, finalize } from "rxjs";

@UntilDestroy()
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormValidatorService],
})
export class LoginComponent {
  isLoading$ = new BehaviorSubject<boolean>(false);
  vkAuthLink = this.userService.vkAuthLink;
  form = this.fb.group({
    username: '',
    password: '',
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
    this.userService.login(this.form.getRawValue()).pipe(
      finalize(() => this.isLoading$.next(false)),
      untilDestroyed(this),
    ).subscribe(() => {
      this.router.navigateByUrl('/');
      this.snackBar.open('Успешная авторизация', 'Закрыть', {
        duration: 2000
      });
    }, error => {
      const errors = getErrors(error);

      setErrorToForm(this.form, errors.apiErrors);

      errors.nonFieldErrors.forEach(error => {
        this.snackBar.open(error, 'Закрыть');
      });

      this.formValidatorService.update();
    });
  }

}
