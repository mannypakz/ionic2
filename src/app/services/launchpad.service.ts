import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LaunchpadService {
  public api_url = "https://launchpad.centrogen.com/dev/api";

  constructor(
    private http: HttpClient,
    public storage: Storage,
    private helper: JwtHelperService,
    private router: Router
    ) { 
      this.check_token();
      this.storage.get('token').then(token => {
        if(token) {
          this.get_lookups(token).subscribe(data => {
            this.storage.set('lookups', JSON.stringify(data));
          });
        }
      });
     }

  login(credentials) {
    let endpoint = `${this.api_url}/users/token.json`;
    let headers = new HttpHeaders({"Content-type": "application/json"});
    return this.http.post(endpoint, JSON.stringify(credentials), {headers: headers}).pipe();
  }

  save_profile(json){
    this.storage.set('user', JSON.stringify(json.data.user));
    this.storage.set('token', json.data.token);
    this.storage.set(`setting:${ 'auth' }`, true);
  }

  check_token() {
    this.storage.get('token').then(token => {
      if(token) {
        let is_expired = this.helper.isTokenExpired(token);
        if(is_expired) {
          this.storage.remove('token');
          this.storage.set(`setting:${ 'auth' }`, false);
          this.router.navigate(['']);
        }
        else {
          this.storage.set(`setting:${ 'auth' }`, true);
        }
      }
    });
  }


  public async logout() {
    this.storage.remove('token');
    this.storage.set(`setting:${ 'auth' }`, false);
    console.log(this.storage.get(`setting:${ 'auth' }`));
  }

  public is_authenticated() {
    const tmp = this.storage.get(`setting:${ 'auth' }`);
    return tmp;
    console.log('this');
  }

  get_lookups(token) {
    let url = `${this.api_url}/dockets/lookups.json`;
    let headers = new HttpHeaders({"Authorization": "Bearer " + token});
    return this.http.get(url, {headers: headers}).pipe();
  }

  upload_docket(data, token) {
    data = JSON.stringify(data);
    let endpoint = `${this.api_url}/dockets/upload.json`;
    let headers = new HttpHeaders({"Authorization" : "Bearer " + token,"Content-Type": "application/json"});
    
    return this.http.post(endpoint, data, {headers: headers}).pipe();
  }
}
