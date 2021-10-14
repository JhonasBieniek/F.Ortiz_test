import { EventEmitter } from "@angular/core";
import { MatSnackBar } from "@angular/material";

export class NotificationService{
    notifier = new EventEmitter<string>()

    constructor(private snackBar: MatSnackBar){}

    
    notify_Old(message: string){
        this.notifier.emit(message)
    }
    
    notify(message: string){
        this.snackBar.open(message, undefined, {
            duration: 4000,
        });
    }
}