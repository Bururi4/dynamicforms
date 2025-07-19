import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {Password} from "../types/password.interface";
import {Checkbox} from "../types/checkbox.interface";

@Injectable({providedIn: 'root'})
export class MockService {
  getPasswords(): Observable<Password[]> {
    return of ([
      {
        password: '000LFey034_',
        passwordRepeat: '000LFey034_'
      },
      // {
      //   password: '&067CKjq945',
      //   passwordRepeat: '&067CKjq945'
      // },
    ])
  }

  getCheckboxes(): Observable<Checkbox[]> {
    return of ([
      {
        code: 'agree0',
        label: 'Понимаю политику сайта',
        value: false
      },
      {
        code: 'agree1',
        label: 'Принимаю условия пользовательского соглашения',
        value: false
      },
      {
        code: 'agree2',
        label: 'Согласие на обработку персональных данных',
        value: true
      }
    ])
  }
}
