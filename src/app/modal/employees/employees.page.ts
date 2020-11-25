import { Component, OnInit, Input } from '@angular/core';
import { NavParams, AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

class Employees {
  public id: string;
  public name: string;
}

class Equipments {
  public id: string;
  public name: string;
}

class TravelEquips {
  public id: string;
  public name: string;
}

@Component({
  selector: 'app-employees',
  templateUrl: './employees.page.html',
  styleUrls: ['./employees.page.scss'],
})
export class EmployeesPage implements OnInit {
  @Input() id: any;
  @Input() token: any;
  @Input() auth: any;

  employees: Employees[];
  employee: Employees;
  tmp: Array<any> = [];

  equipments: Equipments[] = [{id: "", name: ""}];
  equipment: Equipments = {id: "", name: ""};
  e_tmp: Array<any> = [];

  travelequips: TravelEquips[] = [{id: "", name: ""}];
  travelequip: TravelEquips = {id: "", name: ""};
  t_tmp: Array<any> = [];

  job_start_time = '';
  site_start_time = '';
  site_end_time = '';
  job_end_time = '';
  das_employee: Array<any> = [];

  brk = 30;
  _id: number;
  work_order_item_id: number;

  timePickerObj = {
    titleLabel: "Select a Time",
    clearButton: false
  };

  valid_name: any;

  constructor(
    params: NavParams,
    public route: Router,
    private storage: Storage,
    public alert: AlertController,
    public modal: ModalController
  ) {
    if(!params.get('auth')) {
      this.route.navigate(['']);
    }
    
    this._id = params.get('id');

    this.storage.get('das').then(data => {
      if(data) {
        var json = JSON.parse(data);
        for(var h = 0; h < json.length; h++) {
          if(json[h].order_id == this._id) {
            if(json[h].project_work_order_items.length) {
              this.work_order_item_id = json[h].project_work_order_items[0].id;
            }
            else {
              this.work_order_item_id = 0;
            }
          }
        }
      } 
    });
  
    this.storage.get('lookups').then(data => {
      var json = JSON.parse(data);
      if(json.responce.status == 'OK') {
        
        for(var key in json.employees) {
          var obj = new Employees();
          obj.id = key;
          obj.name = json.employees[key];
          this.tmp.push(obj);
        }
        this.employees = this.tmp;
        this.sort(this.employees);
        
        for(var k in json.genericEquipment) {
          var eq = new Equipments();
          eq.id = k;
          eq.name = json.genericEquipment[k];
          this.e_tmp.push(eq)
        }
        this.equipments = this.e_tmp;
        this.sort(this.equipments);

        for(var ky in json.equipment) {
          var tq = new TravelEquips();
          tq.id = ky;
          tq.name = json.equipment[ky];
          this.t_tmp.push(tq);
        }
        this.travelequips = this.t_tmp;
        this.sort(this.travelequips);
      }
      else {
        this.employees = [{id: null, name: null}];
      }
    });
  }

  ngOnInit() {
  }

  sort(element) {
    element.sort(function(a, b){
      if(a.name < b.name) {
        return -1;
      }
      if(a.name > b.name) {
        return 1;
      }
      return 0;
    });
  }

  save_employee(form) {
    var data = form.form.value;
    if(data.employee) {
      this.storage.get('das_employee').then(employee => {
        if(employee) {
          var obj = JSON.parse(employee);
          obj.push(data);
          this.das_employee = obj;
        }
        else {
          console.log('no data');
          this.das_employee.push(data);
        }
        this.storage.set('das_employee', JSON.stringify(this.das_employee));
        this.modal.dismiss({
          data: this.das_employee,
          employee_id: data.employee.id
        });
      },
      err =>{
        console.log("error");
      });
    }
    else {
      this.presentAlert();
    }
  }

  async presentAlert() {
    const alert = await this.alert.create({
      header: 'Error',
      subHeader: '',
      message: "Please enter an employee",
      buttons: ['OK']
    });

    await alert.present();
  }

  close() {
    this.modal.dismiss({
      data: undefined
    });
  }

}
