import {Component} from '@angular/core';
import {
  FormsModule,
  Validators,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  FormArray, FormRecord, ValidatorFn, AbstractControl
} from "@angular/forms";
import {CommonModule} from '@angular/common';
import {PasswordRepeatDirective} from "../directives/password-repeat.directive";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {MockService} from "./mock.service";
import {Password} from "../types/password.interface";
import {Checkbox} from "../types/checkbox.interface";
import {FirstNameValidator} from "../validators/firstname.validator";

function getPasswords(value: Password = {}) {
  return new FormGroup({
    password: new FormControl<string>(value.password ?? '',
      [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*_~]).{8,}$/)]),
    passwordRepeat: new FormControl<string>(value.passwordRepeat ?? '',
      [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*_~]).{8,}$/)]),
  });
}

function validateStartsWith(letter: string): ValidatorFn {
  return (control: AbstractControl) => {
    return control.value.startsWith(letter) ? {startsWith: {message: `Начинайте только не с буквы ${letter}!`}} : null;
  }
}

// const validateStartsWith: ValidatorFn = (control: AbstractControl) => {
//   return control.value.startsWith('Я') ? {startsWith: `Начинайте только не 'Я'!`} : null;
// }

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, PasswordRepeatDirective],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})

export class FormComponent {
  checkboxes: Checkbox[] = [];

  signupForm = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required, Validators.pattern(/^[А-Я]{1}[а-я]+$/), validateStartsWith('К')],
      asyncValidators: [this.firstNameValidator.validate.bind(this.firstNameValidator)],
      updateOn: 'blur',
    }),
    username: new FormControl('', [Validators.required, Validators.pattern(/^(?=.{4,20}$)(?:[a-zA-Z\d]+(?:[._][a-zA-Z\d])*)+$/)]),
    email: new FormControl('', [Validators.required, Validators.pattern(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)]),
    passwords: new FormArray([getPasswords()]),
    agree: new FormControl(false, [Validators.requiredTrue]),
    checkboxes: new FormRecord({})
  });

  constructor(private mockService: MockService, private firstNameValidator: FirstNameValidator) {
    this.mockService.getPasswords()
      .pipe(takeUntilDestroyed())
      .subscribe(passwords => {
        while (this.signupForm.controls.passwords.controls.length > 0) {
          this.signupForm.controls.passwords.removeAt(0);
        }
        // this.signupForm.controls.passwords.clear();

        for (const password of passwords) {
          this.signupForm.controls.passwords.push(getPasswords(password));
        }
        // this.signupForm.controls.passwords.setValue(passwords);

        // this.signupForm.controls.passwords.setControl(1, getPasswords(passwords[0]));
        // console.log(this.signupForm.controls.passwords.at(1).controls.password.value);
        // this.signupForm.controls.passwords.disable();
      });

    this.mockService.getCheckboxes()
      .pipe(takeUntilDestroyed())
      .subscribe(checkboxes => {
        this.checkboxes = checkboxes;

        for (const checkbox of checkboxes) {
          this.signupForm.controls.checkboxes.addControl(checkbox.code, new FormControl(checkbox.value));
        }
      });
  }

  onSubmit(event: SubmitEvent) {
    this.signupForm.markAllAsTouched();
    this.signupForm.updateValueAndValidity();

    if (this.signupForm.invalid) return;
    console.log(this.signupForm.value);
  }

  addPasswordsGroup() {
    this.signupForm.controls.passwords.push(getPasswords());
    // this.signupForm.controls.passwords.insert(0, getPasswords());
  }

  deletePasswordsGroup(index: number) {
    this.signupForm.controls.passwords.removeAt(index, {emitEvent: false});
  }

  sort = () => 0;
}
