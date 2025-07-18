import {Directive} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from "@angular/forms";

@Directive({
  selector: '[passwordRepeatDirective]',
  standalone: true,
  providers: [{provide: NG_VALIDATORS, useExisting: PasswordRepeatDirective, multi: true}]
})
export class PasswordRepeatDirective implements Validator {

  validate(control: AbstractControl): ValidationErrors | null {
    const getPasswordsGroup = control.get('passwords');
    if (!getPasswordsGroup) return null;

    const password = getPasswordsGroup.get('password');
    const passwordRepeat = getPasswordsGroup.get('passwordRepeat');

    if (password?.value !== passwordRepeat?.value) {
      passwordRepeat?.setErrors({passwordRepeat: true});
      return {passwordRepeat: true};
    }

    return null;
  }
}
