import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { EmployeesPage } from '../../modal/employees/employees.page';
import { LoadingController, ModalController, AlertController } from '@ionic/angular';
import { WorkorderService } from '../../services/workorder.service';
import { ProductPage } from '../../modal/product/product.page';
import { DasEditPage } from '../../modal/das-edit/das-edit.page';
import { EmployeeEditPage } from '../../modal/employee-edit/employee-edit.page'; 
import { ProductEditPage } from '../../modal/product-edit/product-edit.page';
import { LaunchpadService } from '../../services/launchpad.service';

class Docket {
comment: string;
dict_target_id: string;
dict_weather_type_id: string;
dict_wind_direction_id: string;
dict_wind_speed_id: string;
end_feature: string;
humidity: string;
max_temp: string;
min_temp: string;
project_id: string;
project_work_order_id: string;
signed: number;
start_feature: string;
status: string;
user_id: number;
work_date: string;
delta_t: number;
protection_officer: number;
km_treated: number;
ha_treated: number;
docket_details: Array<any>;
docket_products: Array<any>;
}

class DocketDetails{
break: number;
employee_id: number;
employee_cost: number;
equipment_cost: number;
job_finish: string;
job_finish_js: string;
job_start: string;
job_start_js: string;
project_work_order_id: string;
site_finish: string;
site_finish_js: string;
site_start: string;
site_start_js: string;
travel_equipment: number;
travel_hours: number;
work_equipment: number;
work_hours: number;
project_work_order_item_id: number;
}

class DocketProducts {
batch_number: string;
product_id: number;
qty: number;
supplied_by: string;
time: string;
other_supplier: string;
}

@Component({
  selector: 'app-dockets',
  templateUrl: './dockets.page.html',
  styleUrls: ['./dockets.page.scss'],
})
export class DocketsPage implements OnInit {
  das: Object = {
    order_id: String,
    order_work_date: String,
    order_start_feature: String,
    order_end_feature: String,
    order_target: String,
    weather: String,
    wind_speed: String,
    wind_direction: String,
    humidity: String,
    min_temp: String,
    max_temp: String,
    comment: String,
    description: String
  };
  id: any;
  token: any;
  auth: any;
  employees: Array<any> = [];
  contains_emp = false;
  products: Array<any> = [];
  contains_prod = false;
  user_id: number;
  upload_errors: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storage: Storage,
    public modal: ModalController,
    public load: LoadingController,
    public alert: AlertController,
    private workorder: WorkorderService,
    private launchpad: LaunchpadService
  ) { 

    this.route.queryParams.subscribe(params => {
      if(this.router.getCurrentNavigation().extras.state) {
        var id = this.router.getCurrentNavigation().extras.state.id;
        var temp = this.router.getCurrentNavigation().extras.state.data;
        var prod = this.router.getCurrentNavigation().extras.state.product;
        this.user_id = this.router.getCurrentNavigation().extras.state.uid;
        var auth = this.router.getCurrentNavigation().extras.state.auth;
        if(!auth) {
          this.router.navigate(['']);
        }

        if(id) {
          this.storage.get('das').then(das => {
            if(das) {
              var json = JSON.parse(das);
              for(var i = 0; i < json.length; i++) {
                if(json[i].order_id == id) {
                  this.das = json[i];
                  this.id = id;
                }
              }
            }
          });

          this.employees = [];
          for(var n = 0; n < temp.length; n++) {
            if(parseInt(id) == parseInt(temp[n]._id)) {
              this.employees.push(temp[n]);
            }
          }

          this.products = [];
          for(var y = 0; y < prod.length; y++) {
            if(parseInt(id) == parseInt(prod[y].das_id)) {
              this.products.push(prod[y]);
            }
          }

        }
      }
      else {
        this.router.navigate(['']);
      }
    });

    this.storage.get('token').then(token => {
      if(token) {
        this.token = token;
      }
    });

    this.storage.get(`setting:${ 'auth' }`).then(auth => {
      if(auth) {
        this.auth = auth;
      }
    });

    this.storage.get('lookups').then(data => {
      if(data) {
        
      }
    });
  }

  ngOnInit() {
  }

  go_back() {
    this.router.navigate(['']);
  }

  async present_employees() {
    const modal = await this.modal.create({
      component: EmployeesPage,
      componentProps: {
        id: this.id,
        token: this.token,
        auth: this.auth
      }
    });

    modal.onDidDismiss().then(data => {
      var emp_id = data.data.employee_id;
      if(data.data && data.data.data) {
        var emp = data.data.data;
        this.employees = [];
        for(var i = 0; i < emp.length; i++) {
          if(parseInt(this.id) == parseInt(emp[i]._id)) {
            this.employees.push(emp[i]);
          }
          // else {
          //   this.employees.splice(i, 1);
          // }
        }
        this.contains_emp = true;
      }
    });
    return await modal.present();
  }

  async present_product() {
    const product_modal = await this.modal.create({
      component: ProductPage,
      componentProps: {
        id: this.id,
        token: this.token,
        auth: this.auth
      }
    });

    product_modal.onDidDismiss().then(resp => {
      if(resp.data) {
        var prod = resp.data.data;
        this.products = [];
        for(var i = 0; i < prod.length; i++) {
          if(parseInt(this.id) == parseInt(prod[i].das_id)) {
            this.products.push(prod[i]);
          }
          else {
            
          }
        }
        this.contains_prod = true;
      }
    });

    return await product_modal.present();
  }

  async present_daspage() {
    const dasmodal = await this.modal.create({
      component: DasEditPage,
      componentProps: {
        id: this.id,
        auth: this.auth
      }
    });

    dasmodal.onDidDismiss().then(data => {
      if(data.data) {
        this.das = data.data.data;
      }

    });

    return await dasmodal.present();
  }

  async present_employee_edit(userid) {
    const empmodal = await this.modal.create({
      component: EmployeeEditPage, 
      componentProps: {
        id: this.id,
        auth: this.auth,
        userid: userid
      }
    });
    empmodal.onDidDismiss().then(data => {
      if(data.data) {
       this.contains_emp = true;
       this.employees = [];
       var obj = data.data.data;
       
       for(var j = 0; j < obj.length; j++) {
        if(parseInt(obj[j]._id) == parseInt(this.id)) {
          this.employees.push(obj[j]);
        }
       }
      }
    });
    return await empmodal.present();
  }

  async present_product_edit(prodid) {
    const prodmodal = await this.modal.create({
      component: ProductEditPage,
      componentProps: {
        id: this.id,
        auth: this.auth,
        prodid: prodid
      }
    });

    prodmodal.onDidDismiss().then(data => {
      if(data.data) {
        this.products = [];
        var ob = data.data.data;
        for(var k = 0; k < ob.length; k++) {
          if(parseInt(ob[k].das_id) == parseInt(this.id)) {
            this.products.push(ob[k]);
          }
        }
      }
    });

    return await prodmodal.present();
  }

  show_prod_edit(prodid) {
    this.present_product_edit(prodid);
  }

  show_emp_edit(userid) {
    this.present_employee_edit(userid);
  }

  show_daspage() {
    this.present_daspage();
  }

  show_prod_modal() {
    this.present_product();
  }

  show_emp_modal() {
    this.present_employees();
  }

  async presentAlertConfirm() {
    const alert = await this.alert.create({
      header: 'Message',
      message: 'Are you sure you want to delete all DAS?',
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

  async confirm_delete(comp, name) {
    const alert = await this.alert.create({
      header: "Message",
      message: "Are you sure you want to delete this " + name + "?",
      buttons: [
        {
          text: "No",
          role: "cancel",
          cssClass: "secondary",
          handler: (text) => {

          }
        },
        {
          text: "Yes",
          handler: () => {
            if(name == "employee") {
              this.delete_emp(comp);
            }

            if(name == "product") {
              this.delete_prod(comp);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  show_delete_component(comp, name) {
    this.confirm_delete(comp, name);
  }

  async presentLoading() {
    const loading = await this.load.create({
      message: 'Please wait...',
      duration: 2500,
      spinner: "lines"
    });
    await loading.present();
    const { data } = await loading.onDidDismiss();
  }

  delete_all() {
    this.contains_emp = false;
    this.contains_prod = false;

    this.presentLoading().then(()=>{
      location.reload();
    });

    this.storage.get('das').then(data => {
      if(data) {
        var json = JSON.parse(data);
        for(var x = 0; x < json.length; x++) {
          if(this.id == json[x].order_id) {
            json.splice(x, 1);
          }
        }
        this.storage.set('das', JSON.stringify(json));

        this.storage.get('das_employee').then(data => {
          if(data) {
            var json = JSON.parse(data);
            var len = json.length;
            this.employees = [];
            for(var i = 0; i < len; i++) {
              if(parseInt(this.id) != parseInt(json[i]._id)) {
                this.employees.push(json[i]);
              }
            }
            this.storage.set('das_employee', JSON.stringify(this.employees));
          }
        });

        this.storage.get('das_product').then(data => {
          if(data) {
            var obj = JSON.parse(data);
            var len = obj.length;
            this.products = [];
            for(var j = 0; j < len; j++) {
              if(parseInt(this.id) != parseInt(obj[j].das_id)) {
                this.products.push(obj[j]);
              }
            }
            this.storage.set('das_product', JSON.stringify(this.products));
          }
        });
      }
    });
  }

  confirm() {
    this.presentAlertConfirm();
  }

  delete_emp(ob) {
    for(var a = 0; a < this.employees.length; a++) {
      if(ob._id == this.employees[a]._id && ob.employee.id == this.employees[a].employee.id) {
        this.employees.splice(a, 1);
      }
    }
    this.storage.set('das_employee', JSON.stringify(this.employees));
  }

  delete_prod(ob) {
    for(var b = 0; b < this.products.length; b++) {
      if(ob.das_id == this.products[b].das_id && ob.das_product.id == this.products[b].das_product.id) {
        this.products.splice(b, 1);
      }
    }
    this.storage.set('das_product', JSON.stringify(this.products));
  }

  convert_to_24hr(time) {
    if(!!time) {
      var hours = Number(time.match(/^(\d+)/)[1]);
      var minutes = Number(time.match(/:(\d+)/)[1]);
      var AMPM = time.match(/\s(.*)$/)[1];
      if(AMPM == "PM" && hours<12) hours = hours+12;
      if(AMPM == "AM" && hours==12) hours = hours-12;
      var sHours = hours.toString();
      var sMinutes = minutes.toString();
      if(hours<10) sHours = "0" + sHours;
      if(minutes<10) sMinutes = "0" + sMinutes;
    
    return sHours + ":" + sMinutes;
    }
  }

  upload_das(id) {
    var object = new Docket();
    var json = JSON.stringify(this.das);
    var struct = JSON.parse(json);
    var details = new DocketDetails();
    var products = new DocketProducts();
    this.upload_loading();

    object.comment = struct.comment;
    object.dict_target_id = struct.target_id;
    object.dict_weather_type_id = struct.weather_id;
    object.dict_wind_direction_id = struct.wind_direction_id;
    object.dict_wind_speed_id = struct.wind_speed_id;
    object.end_feature = struct.order_end_feature;
    object.humidity = struct.humidity;
    object.max_temp = struct.max_temp;
    object.min_temp = struct.min_temp;
    object.project_id = struct.project_id;
    object.project_work_order_id = struct.order_id;
    object.signed = 1000;
    object.start_feature = struct.order_start_feature;
    object.status = "New";
    object.user_id = this.user_id;
    var d = new Date(struct.order_work_date);
    object.work_date = d.toISOString();
    object.delta_t = struct.delta_t;
    object.protection_officer = struct.protection_officer_id;
    object.km_treated = struct.km_treated;
    object.ha_treated = struct.ha_treated;
    object.docket_details = [];
    object.docket_products = [];

    for(var h = 0; h < this.employees.length; h++) {
      details.break = this.employees[h].brk;
      details.employee_cost = 0.00;
      details.employee_id = this.employees[h].employee.id;
      details.equipment_cost = 0.00;
      details.project_work_order_item_id = this.employees[h].work_order_item_id;
      if(!!this.employees[h].job_end) {
        details.job_finish = struct.order_work_date + " " + this.convert_to_24hr(this.employees[h].job_end);
        var jf = new Date(details.job_finish);
        details.job_finish_js = jf.toISOString();
      }
      
      if(!!this.employees[h].job_start) {
        details.job_start = struct.order_work_date + " " + this.convert_to_24hr(this.employees[h].job_start);
        var js = new Date(details.job_start);
        details.job_start_js = js.toISOString();
      }
      
      details.project_work_order_id = this.employees[h]._id;
      if(!!this.employees[h].site_end) {
        details.site_finish = struct.order_work_date + " " + this.convert_to_24hr(this.employees[h].site_end);
        var sf = new Date(details.site_finish);
        details.site_finish_js = sf.toISOString();
      }
      
      if(!!this.employees[h].site_start) {
        details.site_start = struct.order_work_date + " " + this.convert_to_24hr(this.employees[h].site_start);
        var ss = new Date(details.site_start);
        details.site_start_js = ss.toISOString();
      }

      if(!!sf && !!ss) {
        details.travel_hours = ((((sf.getTime() - ss.getTime()) / 1000) / 60) / 60);
        details.travel_hours = parseFloat(details.travel_hours.toFixed(2));
      }

      if(!!jf && !!js) {
        details.work_hours = ((((jf.getTime() - js.getTime()) / 1000) / 60) / 60);
        details.work_hours = parseFloat(details.work_hours.toFixed(2));
      }
      
      details.travel_equipment = this.employees[h].travel_equipment.id;
      details.work_equipment = this.employees[h].equipment.id;
      object.docket_details.push(details);
    }

    for(var i = 0; i < this.products.length; i++) {
      products.batch_number = this.products[i].batch;
      products.product_id = this.products[i].das_product.id;
      products.qty = this.products[i].quantity;
      products.supplied_by = this.products[i].supplier;
      products.time = this.products[i].time;
      if(products.supplied_by == 'Other') {
        products.other_supplier = this.products[i].other_supplier;
      }
      object.docket_products.push(products);
    } 
   
    this.storage.get('token').then(token => {
      if(token) {
        this.launchpad.upload_docket(object, token).subscribe(data => {
          var ob = JSON.stringify(data);
          var json = JSON.parse(ob);
          if(json.responce.status == 'OK') {
            this.load.dismiss();
            this.upload_success();
          }
          else {
            this.upload_errors = '';
            var err_details = json.responce.errors;
            console.log(object);
            console.log(err_details);
            for(var x in err_details) {
              if(Array.isArray(err_details[x])) {
                for(var y in err_details[x]) {
                  this.upload_errors += "<br><div><strong>EMPLOYEE: #" + (parseInt(y) + 1) + "</strong></div>";
                  if(typeof err_details[x][y] === 'object') {
                    for(var o in err_details[x][y]) {
                      if(typeof err_details[x][y][o]) {
                        for(var p in err_details[x][y][o]) {
                          this.upload_errors += "<ion-item class='up-item'>" + err_details[x][y][o][p] + "</ion-item>";
                        }
                      }
                    }
                  }
                }
              }
              else{
                var element = x.replace(/_/g, " ");
                element = element.replace('dict', "");
                element = element.toUpperCase();
                this.upload_errors += "<br><div><strong>" + element + "</strong></div>";
                if(typeof err_details[x] === 'object') {
                  for(var k in err_details[x]) {
                    this.upload_errors += "<ion-item class='up-item'>" + err_details[x][k] + "</ion-item>";
                  }
                }
              }
            }
            
            this.load.dismiss();
            this.upload_alert();
          }
        },
        err => {
          console.log(err);
        });
      }
    });

  }

  async upload_alert() {
    const alert = await this.alert.create({
      header: "Error",
      message: this.upload_errors,
      buttons: ['OK']
    });
    await alert.present();
  }

  async upload_success() {
    const alert = await this.alert.create({
      header: "Success",
      message: "DAS has been uploaded",
      buttons: ['OK']
    });
    await alert.present();
  }

  async upload_loading() {
    const load = await this.load.create({
      spinner: 'lines',
      duration: 0,
      message: 'Uploading...'
    });

    return await load.present();
  }
}
