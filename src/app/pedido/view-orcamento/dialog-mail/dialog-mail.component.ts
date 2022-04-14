import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NotificationService } from '../../../shared/messages/notification.service';
import { SnackbarComponent } from '../../../shared/messages/snackbar/snackbar.component';

@Component({
  selector: 'app-dialog-mail',
  templateUrl: './dialog-mail.component.html',
  styleUrls: ['./dialog-mail.component.css']
})
export class DialogMailComponent implements OnInit {

  public form: FormGroup;
  emailForm = new FormControl(null);
  constructor(
  public dialogRef: MatDialogRef<DialogMailComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,
  private fb: FormBuilder,
  private notificationService: NotificationService){ 
  }

  ngOnInit() {
    this.form = this.fb.group({
      email: [null, Validators.required],
      cc: [''],
      mensagem: ['']
    });

    if(this.data.email){
      this.form.get('email').setValue(this.data.email);
    }

    if(this.data.emails){
      if(this.data.emails.length === 0){
        this.notificationService.notify("A representada não possui emails Cadastrados, cadastre ao menos 1 para prosseguir!");
      }
    }
  }

  setEmail(email:any){
    this.form.get('email').setValue(email.email)
  }

  Cancelar(): void {
    this.dialogRef.close(null);
  }
  
  enviar(){
    if(this.form.valid){
      this.dialogRef.close(this.form.value);
    }else{
      this.notificationService.notify("Necessário selecionar um email.");
    }
  }

}
