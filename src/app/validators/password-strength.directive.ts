import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { PasswordValidatorService } from './password-validator.service';

@Directive({
  selector: '[appPasswordStrength]',
  providers: [{ provide: NG_VALIDATORS, useExisting: PasswordStrengthDirective, multi: true }],
  standalone: false
})
export class PasswordStrengthDirective implements Validator {

  constructor(private passwordValidator: PasswordValidatorService) {}

  validate(control: AbstractControl): ValidationErrors | null {
    return this.passwordValidator.validate(control.value);
  }
}
