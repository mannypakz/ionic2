import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { LaunchpadService } from '../services/launchpad.service';

@Injectable({
  providedIn: 'root'
})
export class WorkorderService {
  constructor(
    private http: HttpClient,
    private storage: Storage,
    private launchpad: LaunchpadService
  ) { }

  get_workorders(token, id) {
    if(token && id) {
      let endpoint = `${this.launchpad.api_url}/dockets/workorder/${id}.json`;
      let headers = new HttpHeaders({"Authorization": "Bearer " + token});
      return this.http.get(endpoint, {headers: headers}).pipe();
    }
  }

  get_token() {
    return this.storage.get('token');
  }
}
