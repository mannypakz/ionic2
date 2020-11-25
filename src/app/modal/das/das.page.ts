import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'das-page',
  templateUrl: './das.page.html',
  styleUrls: ['./das.page.scss'],
})
export class DasPage implements OnInit {
  workorders: Array<Object> = [];
  myDate = 'YOUR_DATE';
  datePickerObj: any = {
    inputDate: new Date(),
    dateFormat: 'YYYY-MM-DD',
    titleLabel: 'Select a Date',
    clearButton: false
  };
  lookups: any;
  targets: Array<String> = [];
  weather: Array<String> = [];
  wind_speed: Array<String> = [];
  wind_direction: Array<String> = [];
  das: Array<any> = [];
  employees: Array<any> = [];
  
  constructor(
    public modal: ModalController,
    private storage: Storage,
    public alert: AlertController
  ) {
    this.storage.get('saved_orders').then(data => {
      this.workorders = JSON.parse(data);
    });

    this.storage.get('das').then(das => {
      if(das) {
        this.das = JSON.parse(das);
      }
    });

    this.storage.get('lookups').then(data => {
      this.lookups = JSON.parse(data);
  
      var obj = JSON.parse(data);
      for(var key in obj.dictTargets) {
        this.targets.push(obj.dictTargets[key]);
      }
      this.sort(this.targets);
      
      for(var key in obj.dictWeatherTypes) {
        this.weather.push(obj.dictWeatherTypes[key]);
      }
      this.sort(this.weather);

      for(var key in obj.dictWindSpeeds) {
        this.wind_speed.push(obj.dictWindSpeeds[key]);
      }
      this.sort(this.wind_speed);
  
      for(var key in obj.dictWindDirections) {
        this.wind_direction.push(obj.dictWindDirections[key]);
      }
      this.sort(this.wind_direction);

      for(var key in obj.employees) {
        this.employees.push(obj.employees[key]);
      }
      this.sort(this.employees);
      
    });
   }

  ngOnInit() {}
  
  sort(element) {
    element.sort(function(a, b){
      if(a < b) {
        return -1;
      }
      if(a > b) {
        return 1;
      }
      return 0;
    });
  }

  dismiss() {
    this.modal.dismiss();
  }

  get_dates() {
    console.log("here");
  }

  save_das(form) {
    if(form.value.order_id && form.value.order_work_date) {
      var dup = false;
      if(this.das) {
        for(var i = 0; i < this.das.length; i++) {
          if(this.das[i].order_id == form.value.order_id) {
            dup = true;
            break;
          }
        }
      }
      if(!dup) {
        this.storage.get('saved_orders').then(data => {
          if(data) {
            var json = JSON.parse(data);
            for(var j = 0; j < json.length; j++) {
              if(json[j].id == form.value.order_id) {
                form.value.description = json[j].description;
                form.value.project_id = json[j].projectid;
                form.value.status = json[j].status;
                form.value.region = json[j].region;
                form.value.state = json[j].state;
                form.value.branch = json[j].branch;
                form.value.target_id = this.targets.indexOf(form.value.order_target);
                form.value.weather_id = this.weather.indexOf(form.value.weather);
                form.value.wind_direction_id = this.wind_direction.indexOf(form.value.wind_direction);
                form.value.wind_speed_id = this.wind_speed.indexOf(form.value.wind_speed);
                form.value.project_work_order_items = json[j].project_work_order_items;
                form.value.protection_officer_id = this.employees.indexOf(form.value.protection_officer);
              }
            }
            this.das.push(form.value);
            console.log(this.das);
            this.storage.set('das', JSON.stringify(this.das));
          }
          else {
            console.log("no data");
          }
          this.modal.dismiss({
            'dismissed': true
          });
        });
      }
      else {
        console.log("duplicate");
        this.modal.dismiss({
          'dismissed': true
        });
      }
    }
    else {
      this.presentAlert();
    }
  }

  async presentAlert() {
    const alert = await this.alert.create({
      header: 'Error',
      subHeader: '',
      message: "Please enter work id and work start date",
      buttons: ['OK']
    });

    await alert.present();
  }


}
