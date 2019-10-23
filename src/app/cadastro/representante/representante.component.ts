import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map'
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';


const password = new FormControl('', Validators.required);
const confirmPassword = new FormControl('', CustomValidators.equalTo(password));
const password2 = new FormControl('', Validators.required);
const confirmPassword2 = new FormControl('', CustomValidators.equalTo(password2));

export class State {
  constructor(public name: string, public population: string, public flag: string) { }
}

const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';

@Component({
  selector: 'app-representante',
  templateUrl: './representante.component.html',
  styleUrls: ['./representante.component.scss']
})
export class RepresentanteComponent implements OnInit {

  public form: FormGroup;
  public form2: FormGroup;
  stateCtrl: FormControl;
  filteredStates: Observable<any[]>;

  states: State[] = [
    {
      name: 'Arkansas',
      population: '2.978M',
      // https://commons.wikimedia.org/wiki/File:Flag_of_Arkansas.svg
      flag: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Arkansas.svg'
    },
    {
      name: 'California',
      population: '39.14M',
      // https://commons.wikimedia.org/wiki/File:Flag_of_California.svg
      flag: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_California.svg'
    },
    {
      name: 'Florida',
      population: '20.27M',
      // https://commons.wikimedia.org/wiki/File:Flag_of_Florida.svg
      flag: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Florida.svg'
    },
    {
      name: 'Texas',
      population: '27.47M',
      // https://commons.wikimedia.org/wiki/File:Flag_of_Texas.svg
      flag: 'http://www.mundodageografia.com.br/wp-content/uploads/2015/06/Bandeira_do_Acre.png'
    }
  ];

  uploader: FileUploader = new FileUploader({
    url: URL,
    isHTML5: true
    });
    hasBaseDropZoneOver = false;
    hasAnotherDropZoneOver = false;

  constructor(private fb: FormBuilder) {
   this.stateCtrl = new FormControl();
    this.filteredStates = this.stateCtrl.valueChanges
      .pipe(
        startWith(''),
        map(state => state ? this.filterStates(state) : this.states.slice())
      )
  }
  filterStates(name: string) {
    return this.states.filter(state =>
      state.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }
  ngOnInit() {
    this.form = this.fb.group({
      fname: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      representante: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      email: [null, Validators.compose([Validators.required, CustomValidators.email])],
      cep: [null, Validators.compose([Validators.required, CustomValidators.number])],
      logradouro: [null, Validators.compose([Validators.required, CustomValidators.number])],
      numero: [null, Validators.compose([Validators.required, CustomValidators.number])],
      complemento: [null, Validators.compose([Validators.required, CustomValidators.number])],
      bairro: [null, Validators.compose([Validators.required, CustomValidators.number])],
      cidade: [null, Validators.compose([Validators.required, CustomValidators.number])],
      estado: [null, Validators.compose([Validators.required, CustomValidators.number])],
      cpf: [null, Validators.compose([Validators.required, CustomValidators.digits])],
      rg: [null, Validators.compose([Validators.required, CustomValidators.url])],
      date: [null, Validators.compose([Validators.required, CustomValidators.date])],
      phone: [null, Validators.compose([Validators.required, CustomValidators.phone('IN')])],
      phone2: [null, Validators.compose([Validators.required, CustomValidators.phone('IN')])],
      phone3: [null, Validators.compose([Validators.required, CustomValidators.phone('IN')])],
      gender: [null, Validators.required],
      estadocivil: [null, Validators.required],
      password: password,
      confirmPassword: confirmPassword,
      hideRequired: false,
      floatLabel: 'auto',
    });
    this.form2 = this.fb.group({
      fname2: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      rsocial: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      cnpj: [null, Validators.compose([Validators.required, CustomValidators.digits])],
      ie: [null, Validators.compose([Validators.required, CustomValidators.digits])],
      email2: [null, Validators.compose([Validators.required, CustomValidators.email])],
      cep2: [null, Validators.compose([Validators.required, CustomValidators.number])],
      logradouro2: [null, Validators.compose([Validators.required, CustomValidators.number])],
      numero2: [null, Validators.compose([Validators.required, CustomValidators.number])],
      complemento2: [null, Validators.compose([Validators.required, CustomValidators.number])],
      bairro2: [null, Validators.compose([Validators.required, CustomValidators.number])],
      cidade2: [null, Validators.compose([Validators.required, CustomValidators.number])],
      url2: [null, Validators.compose([Validators.required, CustomValidators.url])],
      phonepj: [null, Validators.compose([Validators.required, CustomValidators.phone('IN')])],
      phonepj2: [null, Validators.compose([Validators.required, CustomValidators.phone('IN')])],
      phonepj3: [null, Validators.compose([Validators.required, CustomValidators.phone('IN')])],
      representante: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      contato: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      //stateCtrl: [null, Validators.required],

    });
  }
  hide = true;

}
