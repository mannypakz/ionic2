import { Component, OnInit } from '@angular/core';
import { LaunchpadService } from '../../services/launchpad.service';
import { LoadingController, ModalController, AlertController } from '@ionic/angular';
import { WorkorderPage } from '../../modal/workorder/workorder.page';
import { DasPage } from '../../modal/das/das.page';
import { WorkorderService } from '../../services/workorder.service';
import { Storage } from '@ionic/storage';
import { Router, NavigationExtras } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  online = false;
  length: number = 0;
  error: string;
  das: Array<any> = [];
  show_all = true;
  employee: Array<any> = [];
  product: Array<any> = [];
  contains_das = false;
  user_id: number;
  auth: any;
  
  constructor(
    private launchpad: LaunchpadService, 
    public loadingController: LoadingController, 
    public modalController: ModalController,
    public orders: WorkorderService,
    public storage: Storage,
    public alert: AlertController,
    public router: Router
  ) { 
    console.log(this.online);
    this.storage.get('orders_count').then(data => {
      this.length = data;
    });

    this.display_das();
    this.storage.get('das_employee').then(data => {
      if(data) {
        this.employee = JSON.parse(data);
      }
    });

    this.storage.get('das_product').then(data => {
      if(data) {
        this.product = JSON.parse(data);
      }
    });

    this.storage.get('saved_orders').then(das => {
      if(das) {
        this.contains_das = true;
      }
    });

    this.storage.get('user').then(data => {
      if(data) {
        var j = JSON.parse(data);
        this.user_id = j.id;
      }
    });

    this.storage.get('auth').then(auth => {
      if(auth) {
        this.auth = auth;
      }
      else {
       this.auth = false;
      }
    });
   }

  public async ngOnInit() {
    this.online = await this.launchpad.is_authenticated();
  }

  login(form) {
    this.presentLoading();
    this.launchpad.login(form.value).subscribe(async data => {
     var obj = JSON.stringify(data);
     var json = JSON.parse(obj);
     if(json.success) {
      this.launchpad.save_profile(json);
      await this.launchpad.is_authenticated().then((data) => {
        this.online = true;
        location.reload();
      });
     }
     else {
      this.error = "Incorrect username or Password!";
      this.presentAlert();
     }
     this.loadingController.dismiss();
    },
    err => {
      this.error = "There was an error logging in";
      this.loadingController.dismiss();
      console.log(err);
    });
  }

  public async logout() {
    this.launchpad.logout();
    this.online = await this.launchpad.is_authenticated();
    location.reload();
  }

  refresh() {
    location.reload();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 0,
      spinner: "lines"
    });
    await loading.present();
    const { data } = await loading.onDidDismiss();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: WorkorderPage,
    });

    modal.onDidDismiss().then(data =>{
      if(data.data) {
        this.length = data.data.data;
        if(this.length) {
          this.contains_das = true;
        }
        else {
          this.contains_das = false;
        }
      }
    });
    
    return await modal.present();
  }

  async present_das() {
    const modal = await this.modalController.create({
      component: DasPage
    });

    modal.onDidDismiss().then(data => {
      this.storage.get('das').then(das => {
        if(das) {
          var obj = JSON.parse(das);
          this.das = obj;
        }
      });
    });

    return await modal.present();
  }

  show_das() {
    this.present_das();
  }

  show_workorder() {
    this.presentModal();
  }

  async presentAlert() {
    const alert = await this.alert.create({
      header: 'Error',
      subHeader: '',
      message: this.error,
      buttons: ['OK']
    });

    await alert.present();
  }

  display_das() {
    this.storage.get('das').then(das => {
      if(das) {
        var obj = JSON.parse(das);
        this.das = obj;
      }
    });
  }

  show_orders_all() {
    if(this.show_all) {
      this.show_all = false;
    }
    else {
      this.show_all = true;
    }
  }

  openDetailsWithState(id, type) {
    let navigation: NavigationExtras = {
      state: {
        id: id,
        type: type,
        data: this.employee,
        product: this.product,
        uid: this.user_id,
        auth: this.auth
      }
    };
    this.router.navigate(['dockets'], navigation);
  }

}
