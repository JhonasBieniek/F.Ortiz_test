import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent implements OnInit {

  type: {name: string, value:number}[] = []
  relatorios: {name: string, value:number}[] = [
    {name:"Clientes", value: 1},
  ]

  constructor() { }

  ngOnInit() {
  }

}
