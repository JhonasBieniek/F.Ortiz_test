import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-fila-impressao',
  templateUrl: './fila-impressao.component.html',
  styleUrls: ['./fila-impressao.component.scss']
})
export class FilaImpressaoComponent implements OnInit {

  public form: FormGroup;


  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      fname: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      fname2: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
    });
  }

}
