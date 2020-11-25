import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, NavParams } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

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
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.page.html',
  styleUrls: ['./employee-edit.page.scss'],
})
export class EmployeeEditPage implements OnInit {
  employees: Employees[];
  employee: Employees = {id: "", name: ""};
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
  userid: string;
  old_emp: Employees = {id: "", name: ""};
  work_order_item_id: number;

  timePickerObj = {
    titleLabel: "Select a Time",
    clearButton: false
  };

  constructor(
    private modal: ModalController,
    private storage: Storage,
    private params: NavParams,
    private router: Router,

  ) {
    if(!params.get('auth')) {
      this.router.navigate(['']);
    }

    this.userid = params.get('userid');
    this._id = params.get('id');
  
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

    this.storage.get('das_employee').then(data => {
      if(data) {
        var json = JSON.parse(data);
        for(var i = 0; i < json.length; i++) {
          if(this._id == json[i]._id && this.userid == json[i].employee.id) {
            this.employee.id = json[i].employee.id;
            this.employee.name = json[i].employee.name;
            this.job_start_time = json[i].job_start;
            this.site_start_time = json[i].site_start;
            this.site_end_time = json[i].site_end;
            this.job_end_time = json[i].job_end;
            this.brk = json[i].brk;
            this.equipment.id = json[i].equipment.id;
            this.equipment.name = json[i].equipment.name;
            this.travelequip.id = json[i].travel_equipment.id;
            this.travelequip.name = json[i].travel_equipment.name;
            this.old_emp.id = json[i].employee.id;
            this.old_emp.name = json[i].employee.name;
            this.work_order_item_id = json[i].work_order_item_id;
          }
        }
        console.log(this.work_order_item_id);
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

  close() {
    this.modal.dismiss();
  }

  update_employee(form) {
    var data = form.form.value;
    if(data) {
      this.storage.get('das_employee').then(resp => {
        if(resp) {
          var json = JSON.parse(resp);
          for(var i = 0; i < json.length; i++) {
            if(this.old_emp.id == json[i].employee.id && this._id == json[i]._id) {
              json[i] = data;
            }
          }
          this.storage.set('das_employee', JSON.stringify(json));
          this.modal.dismiss({
            data: json
          });
        }
      });
    }
  }


}
