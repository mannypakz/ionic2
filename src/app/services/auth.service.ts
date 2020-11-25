import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { LaunchpadService } from '../services/launchpad.service';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {

  constructor(
    public auth: LaunchpadService,
    public storage: Storage
  ) { }

  canActivate(): Promise<any> {
     return this.auth.is_authenticated();
  }
}
