import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-orc-listar',
  templateUrl: './orc-listar.component.html',
  styleUrls: ['./orc-listar.component.css']
})
export class OrcListarComponent implements OnInit {

  rota:string = "orcamentos"

  constructor() { }

  ngOnInit() {
  }

}
