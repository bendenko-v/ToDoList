import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormValidatorService } from "../../../../services/form-validator.service";
import { UserService } from "../../../../services/user.service";
import { getErrors, setErrorToForm } from "../../../shared/helpers/form";

@UntilDestroy()
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormValidatorService],
})
export class ProfileComponent implements OnInit {
  formProfile = this.fb.group({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
  });
  formPassword = this.fb.group({
    old_password: '',
    new_password: '',
  });

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private formValidatorService: FormValidatorService,
  ) {
  }

  ngOnInit(): void {
    this.userService.user$.pipe(
      untilDestroyed(this)
    ).subscribe(user => {
      this.formProfile.patchValue(user || {});
    })
  }

  updateProfile(): void {
    this.snackBar.dismiss();
    this.userService.updateUser(this.formProfile.getRawValue()).subscribe(
      () => this.snackBar.open('Успешно обновлён', 'Закрыть', { duration: 2000 }),
      error => {
        const errors = getErrors(error);
        setErrorToForm(this.formProfile, errors.apiErrors);

        errors.nonFieldErrors.forEach(error => {
          this.snackBar.open(error, 'Закрыть');
        })

        this.formValidatorService.update();
      }
    )
  }

  updatePassword(): void {
    this.snackBar.dismiss();
    this.userService.updatePassword(this.formPassword.getRawValue()).subscribe(
      () => this.snackBar.open('Успешно обновлён', 'Закрыть', { duration: 2000 }),
      error => {
        const errors = getErrors(error);
        setErrorToForm(this.formPassword, errors.apiErrors);

        errors.nonFieldErrors.forEach(error => {
          this.snackBar.open(error, 'Закрыть');
        })

        this.formValidatorService.update();
      }
    )
  }

}
