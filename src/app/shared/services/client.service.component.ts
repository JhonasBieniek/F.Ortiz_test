import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { NotificationService } from '../messages/notification.service';
import * as jwt_decode from 'jwt-decode';


export const API_URL = "http://test2.fortiz.com.br/api/"

@Injectable()
export class ClientService {

  result: any;
  resposta
  token:any;

  constructor(private http: HttpClient,  private notificationService: NotificationService) {}

  getToken(): string {
    this.token = localStorage.getItem('TOKEN_NAME');
    console.log(JSON.stringify(this.token))
    return this.token
  }

  getTokenExpirationDate(token: string): Date {
    const decoded = jwt_decode(token);

    if (decoded.exp === undefined) return null;
    const date = new Date(0); 
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  isTokenExpired(token?: string): boolean {
    if(!token) token = this.getToken();
    if(!token) return true;

    const date = this.getTokenExpirationDate(token);
    if(date === undefined) return false;
    return !(date.valueOf() > new Date().valueOf());
  }

  addAreaVenda(dados) {
    const uri = `${API_URL}` + `area-vendas/add.json`;
    const obj = {
      dados
    };
    this
      .http
      .post(uri, dados[0]) 
      .subscribe(res =>
          console.log('Done'));
  }
  addNota(data){
    const uri = `${API_URL}` + `notas/add.json`;
    return this
      .http
      .post(uri, data) 
  }
  addRegiao(dados) {
    const uri = `${API_URL}` + `regioes/add.json`;
    const obj = {
      dados
    };
    this
      .http
      .post(uri, dados[0]) 
      .subscribe(res =>
          console.log('Done'));
  }
  addCargo(dados) {
    const uri = `${API_URL}` + `cargos/add.json`;
    const obj = {
      dados
    };
    this
      .http
      .post(uri, dados[0]) 
      .subscribe(res =>
          console.log('Done'));
  }
  addCondComerciais(dados) {
    const uri = `${API_URL}` + `condicoes-comerciais/add.json`;
    const obj = {
      dados
    };
    this
      .http
      .post(uri, dados[0]) 
      .subscribe(res =>
          console.log('Done'));
  }
  addUnidades(dados) {
    const uri = `${API_URL}` + `unidades/add.json`;
    this
      .http
      .post(uri, dados[0]) 
      .subscribe(res =>
          console.log('Done'));
  }
  addUsuarios(dados) {
    const uri = `${API_URL}` + `usuarios/add.json`;
    this
      .http
      .post(uri, dados[0]) 
      .subscribe(res =>
          console.log('Done Add User!'));
  }
  addGrupos(dados) {
    const uri = `${API_URL}` + `grupos/add.json`;
    this
      .http
      .post(uri, dados[0]) 
      .subscribe(res =>
          console.log('Done Add User!'));
  }
  addRamos(dados) {
    const uri = `${API_URL}` + `ramoAtividades/add.json`;
    return this
      .http
      .post(uri, dados) 
      
  }
  addComissoes(dados) {
    const uri = `${API_URL}` + `comissoes/add.json`;
    this
      .http
      .post(uri, dados[0]) 
      .subscribe(res =>
          console.log('Done'));
  }
  addProdutos(dados) {
    const uri = `${API_URL}` + `produtos/add.json`;
     return this
      .http
      .post(uri, dados) 
  }
  addPedido(data) {
    const uri = API_URL+ 'pedidos/add.json';
    return this
      .http
      .post(uri, data) 
      
  }
  addOrcamento(data) {
    const uri = API_URL+ 'orcamentos/add.json';
    return this
      .http
      .post(uri, data) 
      
  }
  addCliente(data){
    const uri = API_URL+ 'clientes/add.json';
    return this
      .http
      .post(uri, data) 
  }
  
  getProdutos() {
    const uri = `${API_URL}` + `produtos/index.json`;
    return this
            .http
            .get(uri)
            .map(res => {
              return res;
            });
  }
  getUsuarios() {
    const uri = `${API_URL}` + `usuarios/index.json`;
    return this
            .http
            .get(uri)
            .map(res => {
              return res;
            });
  }
  getAreaVenda() {
    const uri = `${API_URL}` + `area-vendas/index.json`;
    return this
            .http
            .get(uri)
            .map(res => {
              return res;
            });
  }
  getRepresentadas() {
    const uri = `${API_URL}` + `representadas/index.json`;
    return this
            .http
            .get(uri)
            .map(res => {
              return res;
            });
  }
  getForncedores() {
    const uri = `${API_URL}` + `fornecedores/index.json`;
    return this
            .http
            .get(uri)
            .map(res => {
              return res;
            });
  }
  getComissoes() {
    const uri = `${API_URL}` + `comissoes/index.json`;
    return this
            .http
            .get(uri)
            .map(res => {
              return res;
            });
  }
  getFuncionarios() {
    const uri = `${API_URL}` + `funcionarios/index.json`;
    return this
            .http
            .get(uri)
            .map(res => {
              return res;
            });
  }
  getCargos() {
    const uri = `${API_URL}` + `cargos/index.json`;
    return this
            .http
            .get(uri)
            .map(res => {
              return res;
            });
  }
  getCondComerciais() {
    const uri = `${API_URL}` + `condicoes-comerciais/index.json`;
    return this
            .http
            .get(uri)
            .map(res => {
              return res;
            });
  }
  getPedidos() {
    const uri = `${API_URL}` + `pedidos/index.json`;
    return this
            .http
            .get(uri)
            .map(res => {
              return res;
            });
  }
  getNotas() {
    const uri = `${API_URL}` + `notas/index.json`;
    return this
            .http
            .get(uri)
            .map(res => {
              return res;
            });
  }
  getPedidoSemNota() {
    const uri = `${API_URL}` + `notas/getPedidoSemNota.json`;
    return this
            .http
            .get(uri)
            .map(res => {
              return res;
            });
  }
  getOrcamentos() {
    const uri = `${API_URL}` + `orcamentos/index.json`;
    return this
            .http
            .get(uri)
            .map(res => {
              return res;
            });
  }
  getUnidades() {
    const uri = `${API_URL}` + `unidades/index.json`;
    return this
            .http
            .get(uri)
            .map(res => {
              return res;
            });
  }
  getRegioes() {
    const uri = `${API_URL}` + `regioes/index.json`;
    return this
            .http
            .get(uri)
            .map(res => {
              return res;
            });
  }
  getGrupos() {
    const uri = `${API_URL}` + `grupos/index.json`;
    return this
            .http
            .get(uri)
            .map(res => {
              return res;
            });
  }
  getRamos() {
    const uri = `${API_URL}` + `ramoAtividades/index.json`;
    return this
            .http
            .get(uri)
            .map(res => {
              return res;
            });
  }

  getClientesId(id) {
    const uri = `${API_URL}` +`clientes/view/` + id + ".json";
    return this
            .http
            .get(uri)
            .map(res => {
              return res;
            });
  }
  getClientesCnpj(id) {
    const uri = `${API_URL}` +`clientes/findCnpj/` + id + ".json";
    return this
            .http
            .get(uri)
            .map(res => {
              return res;
            });
  }
  getProdutosRepresentada(id) {
    const uri = `${API_URL}` +`produtos/produtosRepresentada/` + id + ".json";
    return this
            .http
            .get(uri)
            .map(res => {
              return res;
            });
  }
  getClientes() {
    const uri = `${API_URL}` + `clientes/index.json`;
    return this
            .http
            .get(uri)
            .map(res => {
              return res;
            });
  }
  getCep(cep) {
    const uri = API_URL + 'enderecos/getCEP/' +cep + '.json';
    return this
          .http
          .get(uri)
          .map(res => {
            return res;
          });
  }
  getProduto(id) {
    const uri = API_URL + 'produtos/get/' + id + ".json";
    return this
            .http
            .get(uri)
            .map(res => {
              return res;
            });
  }
  getProdutoCode(code) {
    const uri = API_URL + 'produtos/getByCode/' + code + ".json";
    return this
            .http
            .get(uri)
            .map(res => {
              return res;
            });
  }

  getApiCnpj(cnpj){
    console.log(String(cnpj).length)
    const uri = 'https://www.receitaws.com.br/v1/cnpj/';
    if(String(cnpj).length == 14){
      return this.http.jsonp(uri + cnpj, "callback").map(res => {
        return res;
      })
    }if(String(cnpj).length == 13){
      return this.http.jsonp(uri + '0' + cnpj, "callback").map(res => {
        return res;
      })
    }else{
      this.notificationService.notify("CNPJ INCORRETO!")
    }
  }

}