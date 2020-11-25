import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule } from '@angular/common/http';
import { Storage, IonicStorageModule } from '@ionic/storage';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { WorkorderPageModule } from './modal/workorder/workorder.module';
import { DasPageModule } from './modal/das/das.module';
import { EmployeesPageModule } from './modal/employees/employees.module';
import { ProductPageModule } from './modal/product/product.module';
import { DasEditPageModule } from './modal/das-edit/das-edit.module';
import { EmployeeEditPageModule } from './modal/employee-edit/employee-edit.module';
import { ProductEditPageModule } from './modal/product-edit/product-edit.module';
import { Ionic4DatepickerModule } from '@logisticinfotech/ionic4-datepicker';
import { FormsModule } from '@angular/forms';
import { IonicSelectableModule } from 'ionic-selectable';
import { IonicTimepickerModule } from '@logisticinfotech/ionic-timepicker';

export function jwtOptionsFactory(storage) {
  return {
    tokenGetter: () => {
      return storage.get('token');
    },
    whitelistedDomains: ['localhost']
  }
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    HttpClientModule, 
    IonicStorageModule.forRoot(),
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [Storage],
      }
    }),
    WorkorderPageModule,
    DasPageModule,
    Ionic4DatepickerModule,
    FormsModule,
    EmployeesPageModule,
    IonicSelectableModule,
    IonicTimepickerModule,
    ProductPageModule,
    DasEditPageModule,
    EmployeeEditPageModule,
    ProductEditPageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
