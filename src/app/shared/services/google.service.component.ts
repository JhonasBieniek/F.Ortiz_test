import { Injectable } from "@angular/core";
import { NotificationService } from "../messages/notification.service";
@Injectable()
export class GoogleService {
    
    constructor(
        private notificationService: NotificationService,
    ) {
        gapi.load('client', () => {
            //console.log('loaded client')
            /*
            usar caso deseje iniciar algum serviço ainda nao autorizado
            gapi.client.init({
                clientId: '1078742420525-80sm10jeu87n9bd445bkjaeusdroofer.apps.googleusercontent.com',
                discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'],
                scope: 'https://mail.google.com/ \
                    https://www.googleapis.com/auth/gmail.modify \
                    https://www.googleapis.com/auth/gmail.compose \
                    https://www.googleapis.com/auth/gmail.send'

            });*/
            gapi.client.load('gmail', 'v1', () =>{ /*console.log('loaded gmail')*/})
        });
    }

    initClient() {
        gapi.load('client', () => {
            console.log('loaded client')
            /* gapi.client.init({
                apiKey: 'AIzaSyBQu_6CDuExZymyNKT2G8v_q6zF2U1TYxg',
                clientId: '193796461952-6ui364glmacfadkg5c3nmrm1d68l7a1j.apps.googleusercontent.com',
                discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'],
                scope: 'https://mail.google.com/ \
                    https://www.googleapis.com/auth/gmail.modify \
                    https://www.googleapis.com/auth/gmail.compose \
                    https://www.googleapis.com/auth/gmail.send'

            });*/
            gapi.client.load('gmail', 'v1', () => console.log('loaded calendar'))
        });
    }


    public list(user: gapi.auth2.GoogleUser) : Promise<gapi.client.gmail.ListMessagesResponse> {
        return new Promise( resolve => {
            gapi.client.gmail.users.messages.list({
                userId: user.getId(),
                access_token: user.getAuthResponse().access_token,
                maxResults: 5
            }).then( response => {
                resolve(response.result)
            })
        })
    }

    public getMessage(user: gapi.auth2.GoogleUser, id:string) : Promise<string>{
        return new Promise( resolve => {
            gapi.client.gmail.users.messages.get({
                userId: user.getId(),
                access_token: user.getAuthResponse().access_token,
                id: id
            }).then( response => {
                resolve(response.result.snippet)
            })
        })
    }
    
    public sendEmailAttach(user: gapi.auth2.GoogleUser, file:string, contato:string, mensagem?:string, assunto?:string, cc?:string){
        var sender = 'me';
        var receiver = contato;
        var subject = assunto;
        var messageText = mensagem;
        var message = [
            'Content-Type: multipart/mixed; boundary="foo_bar_baz"', '\r\n',
            'MIME-Version: 1.0', '\r\n',
            'From: ', sender, '\r\n',
            'To: ', receiver, '\r\n',
            'cc: ', cc, '\r\n',
            'Subject: ', subject, '\r\n\r\n',

            '--foo_bar_baz', '\r\n',
            'Content-Type: text/html; charset="UTF-8"', '\r\n',
            'MIME-Version: 1.0', '\r\n',
            'Content-Transfer-Encoding: 7bit', '\r\n\r\n',

            '<div>', messageText, '</div>', '\r\n\r\n',

            '--foo_bar_baz', '\r\n',
            'Content-Type: application/pdf', '\r\n',
            'MIME-Version: 1.0', '\r\n',
            'Content-Transfer-Encoding: base64', '\r\n',
            'Content-Disposition: attachment; filename="orcamento.pdf"', '\r\n\r\n',

            file, '\r\n\r\n',

            '--foo_bar_baz--'
        ].join('');
                
        var request = gapi.client.gmail.users.messages.send({
            'userId': user.getId(),
            'uploadType' : 'multipart',
            'resource': {
                'raw': window.btoa(message).replace(/\+/g, '-').replace(/\//g, '_')
            }
        });
        request.execute((res) => {
            console.log("enviado com sucesso");
        });
    }

    public sendEmail(user: gapi.auth2.GoogleUser, message: string){

        var email =
            "From: 'me'\r\n" +
            "To: " + 'Afonso <afonsomartiusi@gmail.com>' + "\r\n" +
            "Subject: " + 'teste !!!' + "\r\n" +
            "Content-Type: text/html; charset='UTF-8'\r\n" +
            "Content-Transfer-Encoding: base64\r\n\r\n" +
            "<html><body>" +
            message +
            "</body></html>";

        var request = gapi.client.gmail.users.messages.send({
            'userId': user.getId(),
            'resource': {
                'raw': window.btoa(email).replace(/\+/g, '-').replace(/\//g, '_')
            }
        });
        request.execute((res) => {
            this.notificationService.notify("Email enviado com sucesso.");
        });
    }
}