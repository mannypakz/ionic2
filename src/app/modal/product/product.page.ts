import { Component, OnInit, Input } from '@angular/core';
import { NavParams, AlertController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { IonicSelectableComponent } from 'ionic-selectable';
import { Router } from '@angular/router';

class Items {
  public id: string;
  public name: string;
}

class Qty {
  public id: string;
  public name: string;
}

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {
  @Input() id: any;
  @Input() token: any;
  @Input() auth: any;

  items: Items[] = [{id: "", name: ""}];
  item: Items = {id: "", name: ""};
  tmp: Array<any> = [];

  qties: Qty[] = [{id: "", name: ""}];
  q_tmp: Array<any> = [];

  label = '';
  timePickerObj = {
    titleLabel: "Select a Time"
  };
  das_product: Array<any> = [];
  time = '';
  supplier = '';

  das_id = '';

  constructor(
    params: NavParams,
    private modal: ModalController,
    private storage: Storage,
    private alert: AlertController,
    public route: Router
  ) { 
    if(!params.get('auth')) {
      this.route.navigate(['']);
    }
    this.das_id = params.get('id');
    this.storage.get('lookups').then(data => {
      var json = JSON.parse(data);
      if(json.responce.status == 'OK') {
        for(var key in json.products) {
          var obj = new Items();
          obj.id = key;
          obj.name = json.products[key];
          this.tmp.push(obj);
        }
        this.items = this.tmp;
        this.items.sort(function(a, b){
          if(a.name < b.name) {
            return -1;
          }
          if(a.name > b.name) {
            return 1;
          }
          return 0;
        });

        for(var k in json.productUnits) {
          var obj = new Qty();
          obj.id = k;
          obj.name = json.productUnits[k];
          this.q_tmp.push(obj);
        }
        this.qties = this.q_tmp;
      }
    });
  }

  ngOnInit() {
  }

  close() {
    this.modal.dismiss();
  }

  check(event: {
    component: IonicSelectableComponent,
    value: any 
  }) {
    this.label = this.qties[event.value.id].name;
  }

  get_select(val) {
    this.supplier = val.detail.value;
  }

  save_product(form) {
    var data = form.form.value;
    if(data.das_product.id) {
      data.das_id = this.das_id;
      data.qty_label = this.label;
      this.storage.get('das_product').then(response => {
        var json = JSON.parse(response);
        if(json) {
          var obj = json;
          obj.push(data);
          this.das_product = obj;
        }
        else {
          this.das_product.push(data);
        }
        this.storage.set('das_product', JSON.stringify(this.das_product));
        this.modal.dismiss({
          data: this.das_product
        });
      },
      err => {
        console.log("Error");
      });
    }
    else {
      this.presentAlert();
    }
  }

  async presentAlert() {
    const prod_alert = await this.alert.create({
      header: "Error",
      message: "Please enter a product",
      buttons: ['OK']
    });

    await prod_alert.present();
  }
}
