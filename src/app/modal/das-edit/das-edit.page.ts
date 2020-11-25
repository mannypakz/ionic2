import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController, NavParams } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

class DasData {
  comment: string;
  description: string;
  humidity: string;
  max_temp: string;
  min_temp: string;
  order_end_feature: string;
  order_id: string;
  order_start_feature: string;
  order_target: string;
  order_work_date: string;
  weather: string;
  wind_direction: string;
  wind_speed: string;
  delta_t: number;
  protection_officer: string;
  km_treated: number;
  ha_treated: number;
}

@Component({
  selector: 'app-das-edit',
  templateUrl: './das-edit.page.html',
  styleUrls: ['./das-edit.page.scss'],
})

export class DasEditPage implements OnInit {
  @Input() id: any;
  @Input() auth: any;

  datePickerObj: any = {
    inputDate: new Date(),
    dateFormat: 'YYYY-MM-DD',
    titleLabel: 'Select a Date',
    clearButton: false
  };

  das: DasData = {
    comment: "",
    description: "",
    humidity: "",
    max_temp: "",
    min_temp: "",
    order_end_feature: "",
    order_id: "",
    order_start_feature: "",
    order_target: "",
    order_work_date: "",
    weather: "",
    wind_direction: "",
    wind_speed: "",
    delta_t: 0,
    protection_officer: "",
    km_treated: 0.00,
    ha_treated: 0.00
  };

  lookups: any;
  targets: Array<String> = [];
  weather: Array<String> = [];
  wind_speed: Array<String> = [];
  wind_direction: Array<String> = [];
  protection_officer: Array<any> = [];

  selected_target = false;
  
  constructor(
    public modal: ModalController,
    private storage: Storage,
    private params: NavParams,
    private route: Router
  ) { 
    if(!params.get('auth')) {
      this.route.navigate(['']);
    }

    this.storage.get('das').then(data => {
      if(data) {
        var json = JSON.parse(data);
        
        for(var i = 0; i < json.length; i++) {
          if(this.params.get('id') == json[i].order_id) {
            var obj = new DasData();
            obj.comment = json[i].comment;
            obj.description = json[i].description;
            obj.humidity = json[i].humidity;
            obj.max_temp = json[i].max_temp;
            obj.min_temp = json[i].min_temp;
            obj.order_end_feature = json[i].order_end_feature;
            obj.order_id = json[i].order_id;
            obj.order_start_feature = json[i].order_start_feature;
            obj.order_target = json[i].order_target;
            obj.order_work_date = json[i].order_work_date;
            obj.weather = json[i].weather;
            obj.wind_direction = json[i].wind_direction;
            obj.wind_speed = json[i].wind_speed;
            obj.delta_t = json[i].delta_t;
            obj.protection_officer = json[i].protection_officer;
            obj.km_treated = json[i].km_treated;
            obj.ha_treated = json[i].ha_treated;
          }
        }
        this.das = obj;
      }
    });

    this.storage.get('lookups').then(data => {
      this.lookups = JSON.parse(data);
      var obj = JSON.parse(data);
      for(var key in obj.dictTargets) {
        if(this.das.order_target != obj.dictTargets[key]) {
          this.targets.push(obj.dictTargets[key]);
        }
      }
      this.sort(this.targets);

      for(var key in obj.dictWeatherTypes) {
        if(this.das.weather != obj.dictWeatherTypes[key]) {
          this.weather.push(obj.dictWeatherTypes[key]);
        }
      }
      this.sort(this.weather);

      for(var key in obj.dictWindSpeeds) {
        if(this.das.wind_speed != obj.dictWindSpeeds[key]) {
          this.wind_speed.push(obj.dictWindSpeeds[key]);
        }
      }
      this.sort(this.wind_speed);

      for(var key in obj.dictWindDirections) {
        if(this.das.wind_direction != obj.dictWindDirections[key]) {
          this.wind_direction.push(obj.dictWindDirections[key]);
        }
      }
      this.sort(this.wind_direction);
  
      for(var key in obj.employees) {
        if(this.das.delta_t != obj.employees[key]) {
          this.protection_officer.push(obj.employees[key]);
        }
      }
      this.sort(this.protection_officer);

    });
  }

  ngOnInit() {
  }

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

  close() {
    this.modal.dismiss();
  }

  edit_das(form) {
    var data = form.form.value;
    console.log(data);
    this.storage.get('das').then(resp => {
      if(resp) {
        var json = JSON.parse(resp);
        for(var i = 0; i < json.length; i++) {
          if(json[i].order_id == data.order_id) {
            json[i].comment = data.comment;
            json[i].description = data.description;
            json[i].humidity = data.humidity;
            json[i].max_temp = data.max_temp;
            json[i].min_temp = data.min_temp;
            json[i].order_end_feature = data.order_end_feature;
            json[i].order_id = data.order_id;
            json[i].order_start_feature = data.order_start_feature;
            json[i].order_target = data.order_target;
            json[i].order_work_date = data.order_work_date;
            json[i].weather = data.weather;
            json[i].wind_direction = data.wind_direction;
            json[i].wind_speed = data.wind_speed;
            this.storage.set('das', JSON.stringify(json));
          }
        }
        this.modal.dismiss({
          data: data
        });
        
      }
      else {
        console.log("no data");
      }
    });
  }

}
