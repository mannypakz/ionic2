import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { LaunchpadService } from '../../services/launchpad.service';
import { WorkorderService } from '../../services/workorder.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'workorder-page',
  templateUrl: './workorder.page.html',
  styleUrls: ['./workorder.page.scss'],
})
export class WorkorderPage implements OnInit {
  @Input() name: string;
  token: any;
  public workorders: Array<any> = [];
  id: number;
  wrap: any;

  constructor(
    public modal: ModalController,
    private launchpad: LaunchpadService,
    private workorder: WorkorderService,
    public load: LoadingController,
    private storage: Storage,
    private alert: AlertController
  ) { 
    this.token = this.workorder.get_token();
    this.storage.get('saved_orders').then(data => {
      if(data) {
        this.workorders = JSON.parse(data);
      }
    });
  }

  ngOnInit() {
    
  }

  dismiss() {
    this.modal.dismiss({
      'dismissed': true,
      data: this.workorders.length
    }).then(()=>{
      
    });
  }

  get_workorders() {
  if(!!this.id){
   this.presentLoading();
   this.workorder.get_workorders(this.token['__zone_symbol__value'], this.id).subscribe(data => {
    var obj = JSON.stringify(data);
    var json = JSON.parse(obj);
    
    if(json.responce.status == "OK") {
      this.storage.get('saved_orders').then(data => {
        var work = {id: json.projectWorkOrder.id, 
                    description: json.projectWorkOrder.description, 
                    projectid: json.projectWorkOrder.project_id, 
                    status: json.projectWorkOrder.status, 
                    branch: json.projectWorkOrder.project.branch.name, 
                    state: json.projectWorkOrder.project.branch.state, 
                    region: json.projectWorkOrder.project.branch.region,
                    project_work_order_items: json.projectWorkOrder.project_work_order_items
                  };
        if(data) {
          this.workorders = JSON.parse(data);
          var flag = false;
          for(var n = 0; n < this.workorders.length; n++) {
            if(this.workorders && this.workorders[n].projectid == json.projectWorkOrder.project_id) {
              flag = true;
              break;
            }
          }
          if(!flag) {
            this.workorders.push(work);
          }
        }
        else {
          this.workorders.push(work);
        }
        console.log(this.workorders);
        this.storage.set('orders_count', this.workorders.length);
        this.storage.set('saved_orders', JSON.stringify(this.workorders));
        this.load.dismiss();
      });
    }
    else {
      console.log("Cannot get workorder");
      this.load.dismiss();
    }
   },
   err => {
     console.log("Error: " + err.statusText);
     this.load.dismiss();
   });
  }
  }

  get(data) {
    this.id = data.id;
  }

  delete_order(id){
   for(var i = 0; i < this.workorders.length; i++) {
    if(id == this.workorders[i].id) {
      this.workorders.splice(i, 1);
    }
   }
   this.storage.set('saved_orders', JSON.stringify(this.workorders));
   this.storage.set('orders_count', this.workorders.length);
  }

  async presentLoading() {
    const loading = await this.load.create({
      message: 'Please wait...',
      duration: 0,
      spinner: "lines"
    });
    await loading.present();
    const { role, data } = await loading.onDidDismiss();
  }

  async present_delete_confirm() {
    const alert = await this.alert.create({
      header: 'Message',
      message: 'Are you sure you want to delete all Workorders?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (text) => {
            
          }
        }, {
          text: 'Yes',
          handler: () => {
            this.delete_all();
          }
        }
      ]
    });

    await alert.present();
  }

  show_confirm(length) {
    if(length) {
      this.present_delete_confirm();
    }
  }

  delete_all() {
    this.storage.remove('saved_orders');
    this.storage.set('orders_count', 0);
    this.workorders = [];
  }

}
