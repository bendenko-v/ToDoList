import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Optional,
  Output
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, merge, Observable } from 'rxjs';
import { FormValidatorService } from "../../../../services/form-validator.service";
import { VALIDATION_ERRORS } from "../../../../models/validation";
import { Entity } from "../../../../models/base";

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldComponent {
  @Input() placeholder = '';
  @Input() label = '';
  @Input() control!: FormControl;
  @Input() type: 'input' | 'textarea' | 'select' | 'date' = 'input';
  @Input() selectList!: Entity[];
  @Input() multiple = false;
  @Input() disabled = false;

  @Output() submit = new EventEmitter<void>();

  isError$!: Observable<boolean>;

  constructor(
    @Optional() private formValidatorService: FormValidatorService,
  ) {
  }

  ngOnInit(): void {
    if (!this.formValidatorService) {
      return;
    }

    this.isError$ = merge(
      this.formValidatorService.update$,
      this.control.valueChanges,
    ).pipe(
      map(() => !this.control.valid)
    );
  }

  getErrorMessage(): string {
    if (!this.control.errors) {
      return '';
    }

    return Object.entries(this.control.errors)
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return value;
        }

        return key;
      }).map(error => VALIDATION_ERRORS[error] || error).join(',')
  }

}
