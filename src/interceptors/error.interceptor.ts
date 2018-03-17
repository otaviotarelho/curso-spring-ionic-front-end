import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";
import { StorageService } from "../services/storage.service";
import { AlertController } from "ionic-angular";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(public storage: StorageService, public alertControler: AlertController){}

    intercept(req: HttpRequest<any>, next: HttpHandler) : Observable<HttpEvent<any>>{
        return next.handle(req).catch((error, caught) => {
            let errorObj = error; 

            if(errorObj.error){
                errorObj = errorObj.error;
            }

            if(!errorObj.status) {
                errorObj = JSON.parse(errorObj);
            }

            switch(errorObj.status){
                case 401:
                    this.handle401();
                case 403: 
                    this.handle403();
                    break;
                default:
                    this.handleDefaultError(errorObj);
            }

            return Observable.throw(error);
        }) as any;
    }

    handle403(){
        this.storage.setLocalUser(null);
    }

    handle401() {
        let alert = this.alertControler.create({
            title: "Erro 401: Falha de Autentição",
            message: "Email ou Senha Incorretos",
            enableBackdropDismiss: false,
            buttons: [
                {text: 'OK'}
            ]
        });
        
        alert.present();
    }

    handleDefaultError(errorObj){
        let alert = this.alertControler.create({
            title: "Erro " + errorObj.status + ": " + errorObj.error,
            message: errorObj.message,
            enableBackdropDismiss: false,
            buttons: [
                {text: 'OK'}
            ]
        });
        
        alert.present();
    }
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
};