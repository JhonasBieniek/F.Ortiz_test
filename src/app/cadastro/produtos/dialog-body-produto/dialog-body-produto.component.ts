import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatChipInputEvent, MatAutocomplete, MatAutocompleteSelectedEvent } from "@angular/material";
import { FormBuilder, FormGroup, Validators, ValidationErrors, FormControl } from '@angular/forms';
import { ClientService } from '../../../shared/services/client.service.component';
import { NotificationService } from '../../../shared/messages/notification.service';
import { CustomValidators } from 'ng2-validation';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import * as _ from 'lodash';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-dialog-body-produto',
  templateUrl: './dialog-body-produto.component.html',
  styleUrls: ['./dialog-body-produto.component.css']
})

export class DialogBodyProdutoComponent implements OnInit {
  public form: FormGroup;
  representadas = [];
  unidades = [];
  pageTitle: string = "";
  sizeCtrl = new FormControl();
  colorCtrl = new FormControl();
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredSizes: Observable<any[]>;
  filteredColors: Observable<any[]>;
  sizes: any[] = [];
  tamanhos: any = [];
  colors: any = [];
  cores: any[] = [];

  imageError: string;
  isImageSaved: boolean;
  cardImageBase64: string;

  @ViewChild('sizeInput', { static: false }) sizeInput: ElementRef<HTMLInputElement>;
  @ViewChild('colorInput', { static: false }) colorInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  @ViewChild('autoColor', { static: false }) matAutocompleteColor: MatAutocomplete;

  constructor(public dialogRef: MatDialogRef<DialogBodyProdutoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private clientservice: ClientService,
    private notificationService: NotificationService) {

    this.clientservice.getRepresentadas().subscribe((res: any) => {
      this.representadas = res.data;
    });
    this.clientservice.getProdutoTamanhos().subscribe((res: any) => {
      this.tamanhos = res.data;
    });
    this.clientservice.getProdutoCores().subscribe((res: any) => {
      this.cores = res.data;
    });
  }

  transform() {
    if (this.data === null || this.data.imagem === null) {
      return "./../../../../assets/images/placeholder.png"
    } else {
      return this.sanitizer.bypassSecurityTrustResourceUrl(this.data.imagem);
    }
  }

  ngOnInit() {
    this.form = this.fb.group({
      id: [null],
      nome: [null, Validators.compose([Validators.required])],
      descricao: [null],
      indicacao: [null],
      ipi: [null],
      produto_tamanhos: null,
      produto_estados_precos: null,
      preco_pr_final: null,
      preco_pr_revenda: null,
      preco_sc: null,
      preco_sp: null,
      produto_cores: null,
      certificado_aprovacao: [null],
      codigo_catalogo: [null, Validators.compose([Validators.required])],
      codigo_importacao: [null],
      embalagem: [null],
      representada_id: [null, Validators.compose([Validators.required])],
      imagem: [null],
      status: [true],
    });
    if (this.data == null) {
      this.pageTitle = 'Cadastrar Produto'
    } else {
      console.log(this.data)
      this.pageTitle = 'Editar Produto';
      this.form.patchValue(this.data);
      this.data.produto_estados_precos.filter(e => {
        if(e.estado_id === 16 && e.tipo === 'final'){
          this.form.get('preco_pr_final').setValue(e.preco)
        }if(e.estado_id === 16 && e.tipo === 'revendedor'){
          this.form.get('preco_pr_revenda').setValue(e.preco)
        }if(e.estado_id === 24){
          this.form.get('preco_sc').setValue(e.preco)
        }if(e.estado_id === 25){
          this.form.get('preco_sp').setValue(e.preco)
        }
      })
      this.sizes = this.data.produto_tamanhos;
      this.colors = this.data.produto_cores;
      this.cardImageBase64 = this.data.imagem;
    }
    this.filteredSizes = this.sizeCtrl.valueChanges.pipe(
      startWith(null),
      map((size: any | null) => size ? this._filter(size) : this.tamanhos.slice()));

    this.filteredColors = this.colorCtrl.valueChanges.pipe(
      startWith(null),
      map((color: any | null) => color ? this._filterColor(color) : this.cores.slice()));
  }
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our size
    if ((value || '').trim()) {
      this.sizes.push({ nome: value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
    this.sizeCtrl.setValue(null);

  }

  remove(size: string): void {
    const index = this.sizes.indexOf(size);

    if (index >= 0) {
      this.sizes.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.sizes.push(event.option.value);
    this.sizeInput.nativeElement.value = '';
    this.sizeCtrl.setValue(null);
  }
  addColor(event: MatChipInputEvent): void {

    const input = event.input;
    const value = event.value;

    // Add our color
    if ((value || '').trim()) {
      this.colors.push({ nome: value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
    this.colorCtrl.setValue(null);

  }

  removeColor(color: string): void {
    const index = this.colors.indexOf(color);

    if (index >= 0) {
      this.colors.splice(index, 1);
    }
  }

  selectedColor(event: MatAutocompleteSelectedEvent): void {
    this.colors.push(event.option.value);
    this.colorInput.nativeElement.value = '';
    this.colorCtrl.setValue(null);
  }

  private _filterColor(value: any): string[] {
    const filterValue = value.length == undefined ? null : value.toLowerCase();
    return this.cores.filter((color: any) => color.nome.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filter(value: any): string[] {
    const filterValue = value.length == undefined ? null : value.toLowerCase();
    return this.tamanhos.filter((size: any) => size.nome.toLowerCase().indexOf(filterValue) === 0);

  }
  close() {
    this.dialogRef.close(
    );
  }
  fileChangeEvent(fileInput: any) {
    this.imageError = null;
    if (fileInput.target.files && fileInput.target.files[0]) {
      // Size Filter Bytes
      const max_size = 20971520;
      const allowed_types = ['image/png', 'image/jpeg', 'image/jpg'];
      const max_height = 15200;
      const max_width = 25600;

      if (fileInput.target.files[0].size > max_size) {
        this.imageError =
          'Maximum size allowed is ' + max_size / 1000 + 'Mb';

        return false;
      }

      if (!_.includes(allowed_types, fileInput.target.files[0].type)) {
        this.imageError = 'Only Images are allowed ( JPG | PNG )';
        return false;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          const img_height = rs.currentTarget['height'];
          const img_width = rs.currentTarget['width'];

          console.log(img_height, img_width);


          if (img_height > max_height && img_width > max_width) {
            this.imageError =
              'Maximum dimentions allowed ' +
              max_height +
              '*' +
              max_width +
              'px';
            return false;
          } else {
            const imgBase64Path = e.target.result;
            this.cardImageBase64 = imgBase64Path;
            this.isImageSaved = true;
            // this.previewImagePath = imgBase64Path;
          }
        };
      };

      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  removeImage() {
    this.cardImageBase64 = null;
    this.isImageSaved = false;
  }

  onSubmit() {
    let tamanhos = [];
    let cores = [];
    let precos = [];

    if (this.data != null) {
    this.sizes.forEach(element => {
      tamanhos.push({
        id: element.id,
        nome: element.nome,
        produto_id: element.produto_id
      })
    })
    this.colors.forEach(element => {
      cores.push({
        id: element.id,
        nome: element.nome,
        produto_id: element.produto_id
      })
    })
    precos = [
      {"preco": this.form.value.preco_pr_final , "produto_id": this.data.id, "estado_id": 16, "tipo": "final"},
      {"preco": this.form.value.preco_pr_revenda , "produto_id": this.data.id, "estado_id": 16, "tipo": "revendedor"},
      {"preco": this.form.value.preco_sc , "produto_id": this.data.id, "estado_id": 24, "tipo": null},
      {"preco": this.form.value.preco_sp , "produto_id": this.data.id, "estado_id": 25, "tipo": null}
    ]
  }else{
    this.sizes.forEach(element => {
      tamanhos.push({
        nome: element.nome,
      })
    })
    this.colors.forEach(element => {
      cores.push({
        nome: element.nome,
      })
    })
    precos = [
      {"preco": this.form.value.preco_pr_final , "estado_id": 16, "tipo": "final"},
      {"preco": this.form.value.preco_pr_revenda , "estado_id": 16, "tipo": "revendedor"},
      {"preco": this.form.value.preco_sc , "estado_id": 24, "tipo": null},
      {"preco": this.form.value.preco_sp , "estado_id": 25, "tipo": null}
    ]
  }

    this.form.patchValue({
      imagem: this.cardImageBase64,
      produto_tamanhos: tamanhos,
      produto_cores: cores,
      produto_estados_precos: precos
    })
    console.log(this.form.value)
    if (this.data == null) {
      this.clientservice.addProdutos(this.form.value).subscribe((res: any) => {
        if (res.success == true) {
          this.notificationService.notify(`Cadastro Efetuado com Sucesso!`)
          this.close();
        } else {
          this.notificationService.notify(`Erro contate o Administrador`)
        }
      }
      );
    } else {
      this.clientservice.updateProduto(this.form.value).subscribe(() => {
        this.notificationService.notify("Atualizado com Sucesso!")
        this.close();
      })
    }
  }
}
