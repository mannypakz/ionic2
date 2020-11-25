import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, NavParams } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { IonicSelectableComponent } from 'ionic-selectable';
import { Router } from '@angular/router';

class Items {
  public id: string;
  public name: string;
}


@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.page.html',
  styleUrls: ['./product-edit.page.scss'],
})
export class ProductEditPage implements OnInit {
  das_id = '';
  prodid = '';

  batch: number;
  products: Array<any> = [];
  product: Items = {id: "", name: ""};
  qty = '';
  qty_label = '';
  supplier = '';
  time = '';
  other_supp = '';
  old_prod: Items = {id: "", name: ""};

  timePickerObj = {
    titleLabel: "Select a Time"
  };

  constructor(
    private modal: ModalController,
    public params: NavParams,
    private storage: Storage,
    private router: Router
  ) { 
    
    if(!params.get('auth')) {
      this.router.navigate(['']);
    }

    this.das_id = params.get('id');
    this.prodid = params.get('prodid');

    this.storage.get('das_product').then(data => {
      if(data) {
        var json = JSON.parse(data);
        for(var k = 0; k < json.length; k++) {
          if(this.das_id == json[k].das_id && this.prodid == json[k].das_product.id) {
            this.product.id = json[k].das_product.id;
            this.product.name = json[k].das_product.name;
            this.old_prod.id = json[k].das_product.id;
            this.old_prod.name = json[k].das_product.name;
            this.batch = json[k].batch;
            this.qty_label = json[k].qty_label;
            this.qty = json[k].quantity;
            this.time = json[k].time;
            this.supplier = json[k].supplier
            if(this.supplier == 'Other') {
              this.other_supp = json[k].other_supplier;
            }
          }
        }
      }
    });

    this.storage.get('lookups').then(data => {
      if(data) {
        var json = JSON.parse(data);
        for(var key in json.products) {
          var obj = {id: key, name: json.products[key]};
          this.products.push(obj);
        }
        this.products.sort(function(a, b){
          if(a.name < b.name) {
            return -1;
          }
          if(a.name > b.name) {
            return 1;
          }
          return 0;
        });
      }
    });
  }

  ngOnInit() {
  }

  close() {
    this.modal.dismiss();
  }

  update_product(form) {
    if(form) {
      this.storage.get('das_product').then(data => {
        if(data) {
          var json = JSON.parse(data);
          for(var i = 0; i < json.length; i++) {
            if(this.old_prod.id == json[i].das_product.id && this.das_id == json[i].das_id) {
              json[i] = form;
            }
          }
          this.storage.set('das_product', JSON.stringify(json));
          this.modal.dismiss({
            data: json
          });
        }
      });
    }
  }
}
