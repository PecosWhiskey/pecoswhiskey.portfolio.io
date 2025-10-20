//L'interceptor serve per inviare automaticamente il token al back-end senza doverlo aggiungere manualmente

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  //Se la richiesta nella sua URL include questi percorsi non viene modificata
  if (req.url.includes('/login-admin') || 
      req.url.includes('/registrazione-cliente') || 
      req.url.includes('/login-cliente')) {

        console.log("Richiesta di registrazione o login...");

        return next(req).pipe(
          //Se si verifica un errore, questo viene lanciato e propagato al livello superiore
          catchError((httpError: HttpErrorResponse) => {
            console.log("Errore nella richiesta di registrazione o login:", httpError);
            return throwError(() => httpError);
          })
        );
  }

  //Se la richiesta non include quei percorsi vengono ricavati il token e la sua validità
  const token = tokenService.getToken();
  const isExpired = tokenService.isTokenExpired();

  if(token){
    if(isExpired){
      //Se il token è scaduto l'utente viene reindirizzato al login
      console.log('Token scaduto! Reindirizzamento al login...');
      logout(tokenService, router);
      //Viene quindi lanciato un errore
      return throwError(() => new Error('Token scaduto'));
    }else{
      console.log("Effettuando la richiesta con token...");
      let clonedReq = req;

      //Modifica della richiesta con inserimento del token
      clonedReq = req.clone({
        setHeaders: {
          Authorization:`Bearer ${token}`,
        }
      })
      //Viene inviata al server la richiesta modificata, che include il token
      return next(clonedReq).pipe(
          //cattura eventuali errori
          catchError((httpError: HttpErrorResponse) => {
            if (httpError.status === 401 || httpError.status === 403) {
              console.log('Token non valido! Reindirizzamento al login...');
              logout(tokenService, router);
            }  
            console.log("Errore nella richiesta http", httpError);
            return throwError(() => httpError);
          }
        )
      )
    }
  }else{ 
    //Se il token non è presente la richiesta non viene modificata
    console.log("Effettuando la richiesta senza token...");
    return next(req).pipe(
      catchError((httpError:HttpErrorResponse) => {
        console.log("Errore nella richiesta http", httpError);
        return throwError(()=>httpError);
      })
    )
  }
} 

//Funzione che esegue il logout se viene rilevato che il token non è valido
function logout(tokenService: any, router: Router) {
  tokenService.logout();
  router.navigate(['/tabs/tab3']);
} 