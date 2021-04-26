import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
} from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatChipInputEvent,
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
} from "@angular/material";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidationErrors,
  FormControl,
} from "@angular/forms";
import { ClientService } from "../../../shared/services/client.service.component";
import { NotificationService } from "../../../shared/messages/notification.service";
import { CustomValidators } from "ng2-validation";
import { map, startWith } from "rxjs/operators";
import { Observable } from "rxjs";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import * as _ from "lodash";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-dialog-body-produto",
  templateUrl: "./dialog-body-produto.component.html",
  styleUrls: ["./dialog-body-produto.component.css"],
})
export class DialogBodyProdutoComponent implements OnInit {
  public form: FormGroup;
  representadas = [];
  tiposProduto: any = [];
  materiaisProduto = [];
  unidades = [];
  pageTitle: string = "";
  sizeCtrl = new FormControl();
  colorCtrl = new FormControl();
  aplicationCtrl = new FormControl();
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredSizes: Observable<any[]>;
  filteredColors: Observable<any[]>;
  filteredAplications: Observable<any[]>;
  sizes: any[] = [];
  aplications: any[] = [];
  aplicacoes: any[] = [];
  tamanhos: any = [];
  colors: any = [];
  cores: any[] = [];
  produto: any = [];

  imageError: string;
  isImageSaved: boolean;
  cardImageBase64: string;
  fichaBase64: string; 

  @ViewChild("sizeInput", { static: false })
  sizeInput: ElementRef<HTMLInputElement>;
  @ViewChild("colorInput", { static: false })
  colorInput: ElementRef<HTMLInputElement>;
  @ViewChild("aplicationInput", { static: false })
  aplicationInput: ElementRef<HTMLInputElement>;
  @ViewChild("auto", { static: false }) matAutocomplete: MatAutocomplete;
  @ViewChild("autoColor", { static: false })
  matAutocompleteColor: MatAutocomplete;
  @ViewChild("autoAplication", { static: false })
  matAutocompleteAplication: MatAutocomplete;

  constructor(
    public dialogRef: MatDialogRef<DialogBodyProdutoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private clientservice: ClientService,
    private notificationService: NotificationService
  ) {
    this.clientservice.getRepresentadas().subscribe((res: any) => {
      this.representadas = res.data;
    });
    this.clientservice.getUnidades().subscribe((res: any) => {
      this.unidades = res.data;
    });
    this.clientservice.getProdutoTipos().subscribe((res: any) => {
      this.tiposProduto = res.data;
      this.tiposProduto.map((e) => {
        e.display = e.nome;
        e.value = e.id.toString();
      });
    });
    this.clientservice.getProdutoMaterials().subscribe((res: any) => {
      this.materiaisProduto = res.data;
      this.materiaisProduto.map((e) => {
        e.display = e.nome;
        e.value = e.id.toString();
      });
    });
    this.clientservice.getProdutoTamanhos().subscribe((res: any) => {
      this.tamanhos = res.data;
    });
    this.clientservice.getProdutoCores().subscribe((res: any) => {
      this.cores = res.data;
    });
    this.clientservice.getProdutoAplications().subscribe((res: any) => {
      this.aplicacoes = res.data;
    });
    this.fichaBase64 = this.produto.imagem_ficha;
  }

  transform() {
    if (this.data === null || this.data.imagem === null) {
      return "./../../../../assets/images/placeholder.png";
    } else {
      return this.sanitizer.bypassSecurityTrustResourceUrl(this.produto.imagem);
    }
  }
  

  ngOnInit() {
    this.form = this.fb.group({
      id: [null],
      nome: [null, Validators.compose([Validators.required])],
      descricao: [null],
      descricao_resumida: [null],
      produto_tipo_id: [null],
      produto_material_id: [null],
      ipi: [null],
      produto_estados_precos: null,
      produto_tamanhos: null,
      produto_embalagem: null,
      preco_pr_final: null,
      preco_pr_revenda: null,
      preco_sc: null,
      preco_ms: null,
      preco_sp: null,
      produto_cores: null,
      produto_aplications: null,
      certificado_aprovacao: [null],
      codigo_catalogo: [null, Validators.compose([Validators.required])],
      codigo_importacao: [null],
      previsao_retorno: [null],
      embalagem_nome: null,
      embalagem_un: null,
      embalagem_min: null,
      representada_id: [null, Validators.compose([Validators.required])],
      imagem: [null],
      imagem_ficha: [null],
      status: ["ativo"],
    });
    if (this.data == null) {
      this.pageTitle = "Cadastrar Produto";
    } else {
      this.clientservice.viewProduto(this.data.id).subscribe((res: any) => {
        this.produto = res.data[0];
        this.produto.produto_tipo_id = this.produto.produto_tipo_id.toString();
        this.produto.produto_material_id = this.produto.produto_material_id.toString();
        this.form.patchValue(this.produto);
        this.produto.produto_estados_precos.filter((e) => {
          if (e.estado_id === 16 && e.tipo === "final") {
            this.form.get("preco_pr_final").setValue(e.preco);
          }
          if (e.estado_id === 16 && e.tipo === "revendedor") {
            this.form.get("preco_pr_revenda").setValue(e.preco);
          }
          if (e.estado_id === 24) {
            this.form.get("preco_sc").setValue(e.preco);
          }
          if (e.estado_id === 25) {
            this.form.get("preco_sp").setValue(e.preco);
          }
          if (e.estado_id === 12) {
            this.form.get("preco_ms").setValue(e.preco);
          }
        });
          this.form.get("embalagem_nome").setValue(this.produto.produto_embalagem.nome);
          this.form.get("embalagem_un").setValue(this.produto.produto_embalagem.unidade_id);
          this.form.get("embalagem_min").setValue(this.produto.produto_embalagem.minimo);
  
        this.sizes = this.produto.produto_tamanhos;
        this.colors = this.produto.produto_cores;
        this.aplications = this.produto.produto_aplications;
        this.cardImageBase64 = this.produto.imagem;
        this.fichaBase64 = this.produto.imagem_ficha;
      });
      this.pageTitle = "Editar Produto";
    }

    this.filteredSizes = this.sizeCtrl.valueChanges.pipe(
      startWith(null),
      map((size: any | null) =>
        size ? this._filter(size) : this.tamanhos.slice()
      )
    );

    this.filteredColors = this.colorCtrl.valueChanges.pipe(
      startWith(null),
      map((color: any | null) =>
        color ? this._filterColor(color) : this.cores.slice()
      )
    );

    this.filteredAplications = this.aplicationCtrl.valueChanges.pipe(
      startWith(null),
      map((aplication: any | null) =>
        aplication
          ? this._filterAplication(aplication)
          : this.aplicacoes.slice()
      )
    );
  }
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our size
    if ((value || "").trim()) {
      this.sizes.push({ nome: value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = "";
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
    this.sizeInput.nativeElement.value = "";
    this.sizeCtrl.setValue(null);
  }

  addAplication(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our aplication
    if ((value || "").trim()) {
      this.aplications.push({ nome: value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }
    this.aplicationCtrl.setValue(null);
  }

  removeAplication(aplication: string): void {
    const index = this.aplications.indexOf(aplication);

    if (index >= 0) {
      this.aplications.splice(index, 1);
    }
  }

  selectedAplication(event: MatAutocompleteSelectedEvent): void {
    this.aplications.push(event.option.value);
    this.aplicationInput.nativeElement.value = "";
    this.aplicationCtrl.setValue(null);
  }

  addColor(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our color
    if ((value || "").trim()) {
      this.colors.push({ nome: value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = "";
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
    this.colorInput.nativeElement.value = "";
    this.colorCtrl.setValue(null);
  }

  private _filter(value: any): string[] {
    const filterValue = value.length == undefined ? null : value.toLowerCase();
    return this.tamanhos.filter(
      (size: any) => size.nome.toLowerCase().indexOf(filterValue) === 0
    );
  }

  private _filterColor(value: any): string[] {
    const filterValue = value.length == undefined ? null : value.toLowerCase();
    return this.cores.filter(
      (color: any) => color.nome.toLowerCase().indexOf(filterValue) === 0
    );
  }

  private _filterAplication(value: any): string[] {
    const filterValue = value.length == undefined ? null : value.toLowerCase();
    return this.aplicacoes.filter(
      (aplication: any) =>
        aplication.nome.toLowerCase().indexOf(filterValue) === 0
    );
  }

  close() {
    this.dialogRef.close();
  }
  fileChangeEvent(fileInput: any) {
    this.imageError = null;
    if (fileInput.target.files && fileInput.target.files[0]) {
      // Size Filter Bytes
      const max_size = 20971520;
      const allowed_types = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "application/pdf",
      ];
      const max_height = 15200;
      const max_width = 25600;

      if (fileInput.target.files[0].size > max_size) {
        this.imageError = "Maximum size allowed is " + max_size / 1000 + "Mb";

        return false;
      }

      if (!_.includes(allowed_types, fileInput.target.files[0].type)) {
        this.imageError = "Only Images are allowed ( JPG | PNG )";
        return false;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        var base64;
        const image = new Image();
        image.src = e.target.result;
        base64 = e.target.result;
        this.cardImageBase64 = base64;
        image.onload = (rs) => {
          const img_height = rs.currentTarget["height"];
          const img_width = rs.currentTarget["width"];

          if (img_height > max_height && img_width > max_width) {
            this.imageError =
              "Maximum dimentions allowed " +
              max_height +
              "*" +
              max_width +
              "px";
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

  uploadFicha(fileInput: any) {
    this.imageError = null;
    if (fileInput.target.files && fileInput.target.files[0]) {
      // Size Filter Bytes
      const max_size = 20971520;
      const allowed_types = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "application/pdf",
      ];

      const max_height = 15200;
      const max_width = 25600;

      if (fileInput.target.files[0].size > max_size) {
        this.imageError = "Maximum size allowed is " + max_size / 1000 + "Mb";

        return false;
      }

      if (!_.includes(allowed_types, fileInput.target.files[0].type)) {
        this.imageError = "Only Images are allowed ( JPG | PNG | JPEG | PDF )";
        return false;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        var base64;
        base64 = e.target.result;
        this.fichaBase64 = base64;

      };
      reader.readAsDataURL(fileInput.target.files[0]);

    }
  }
        
printPreview(data){
  var type = 'application/pdf';
  let blob = null;
  const blobURL = URL.createObjectURL( this.pdfBlobConversion(data, 'application/pdf'));
  const theWindow = window.open(blobURL);
  const theDoc = theWindow.document;
  const theScript = document.createElement('script');
  function injectThis() {
      window.print();
  }
  theScript.innerHTML = 'window.onload = ${injectThis.toString()};';
  theDoc.body.appendChild(theScript);
}
//converts base64 to blob type for windows
pdfBlobConversion(b64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 512;
    b64Data = b64Data.replace(/^[^,]+,/, '');
    b64Data = b64Data.replace(/\s/g, '');
    var byteCharacters = window.atob(b64Data);
    var byteArrays = [];

    for ( var offset = 0; offset < byteCharacters.length; offset = offset + sliceSize ) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  dialogAddMaterial() {}

  removeImage() {
    this.cardImageBase64 = null;
    this.isImageSaved = false;
    this.fichaBase64 = undefined;
  }

  removeFicha() {
    this.fichaBase64 = undefined;
  }

  onSubmit() {
    let tamanhos = [];
    let cores = [];
    let aplicacoes = [];
    let precos = [];
    let embalagem = [];
    if (this.produto.produto_embalagem != undefined) {
      embalagem = [
        {
          nome: this.form.value.embalagem_nome,
          minimo: this.form.value.embalagem_min,
          unidade_id: this.form.value.embalagem_un,
          produto_id: this.data.id,
          id: this.produto.produto_embalagem.id,
        },
      ];
    } else {
      embalagem = [
        {
          nome: this.form.value.embalagem_nome,
          minimo: this.form.value.embalagem_min,
          unidade_id: this.form.value.embalagem_un,
        },
      ];
    }

    if (this.data != null) {
      this.sizes.forEach((element) => {
        tamanhos.push({
          id: element.id,
          nome: element.nome,
          produto_id: element.produto_id,
        });
      });
      this.colors.forEach((element) => {
        cores.push({
          id: element.id,
          nome: element.nome,
          produto_id: element.produto_id,
        });
      });
      this.aplications.forEach((element) => {
        aplicacoes.push({
          id: element.id,
          nome: element.nome,
          produto_id: element.produto_id,
        });
      });
      precos = [
        {
          preco: this.form.value.preco_ms,
          produto_id: this.data.id,
          estado_id: 12,
          tipo: null,
        },
        {
          preco: this.form.value.preco_pr_final,
          produto_id: this.data.id,
          estado_id: 16,
          tipo: "final",
        },
        {
          preco: this.form.value.preco_pr_revenda,
          produto_id: this.data.id,
          estado_id: 16,
          tipo: "revendedor",
        },
        {
          preco: this.form.value.preco_sc,
          produto_id: this.data.id,
          estado_id: 24,
          tipo: null,
        },
        {
          preco: this.form.value.preco_sp,
          produto_id: this.data.id,
          estado_id: 25,
          tipo: null,
        },
      ];
    } else {
      this.sizes.forEach((element) => {
        tamanhos.push({
          nome: element.nome,
        });
      });
      this.colors.forEach((element) => {
        cores.push({
          nome: element.nome,
        });
      });
      this.aplications.forEach((element) => {
        aplicacoes.push({
          nome: element.nome,
        });
      });
      precos = [
        { preco: this.form.value.preco_ms, estado_id: 12, tipo: null },
        { preco: this.form.value.preco_pr_final, estado_id: 16, tipo: "final" },
        {
          preco: this.form.value.preco_pr_revenda,
          estado_id: 16,
          tipo: "revendedor",
        },
        { preco: this.form.value.preco_sc, estado_id: 24, tipo: null },
        { preco: this.form.value.preco_sp, estado_id: 25, tipo: null },
      ];
    }
    this.form
      .get("produto_tipo_id")
      .setValue(parseInt(this.form.value.produto_tipo_id));
    this.form
      .get("produto_material_id")
      .setValue(parseInt(this.form.value.produto_material_id));
    this.form.patchValue({
      imagem: this.cardImageBase64,
      imagem_ficha: this.fichaBase64,
      produto_tamanhos: tamanhos,
      produto_embalagem: embalagem[0],
      produto_cores: cores,
      produto_aplications: aplicacoes,
      produto_estados_precos: precos,
    });
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
