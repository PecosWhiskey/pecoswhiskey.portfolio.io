//Protegge le pagine e quindi le rotte ad acesso limitato, quindi solo a coloro che sono autenticati.

import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';


export const authGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService); 
  const router = inject(Router);

  try { 
    // Controlla se l'utente è autenticato
    const isLogged = tokenService.isLogged(); 
    
    if (isLogged) { 
      console.log('Accesso consentito'); 
      // Permette l'accesso 
      return true;
    } else { 
      // Reindirizza al login bloccandone l'accesso 
      console.log('Accesso negato'); 
      router.navigate(['/tabs/tab3']); 
      return false; 
    } 
  } catch (error) { 
    console.error('Errore controllo autenticazione:', error);
    router.navigate(['/tabs/tab3']); 
    return false; 
  }
};
