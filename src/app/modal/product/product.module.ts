import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProductPage } from './product.page';
import { IonicSelectableModule } from 'ionic-selectable';
import { IonicTimepickerModule } from '@logisticinfotech/ionic-timepicker';

const routes: Routes = [
  {
    path: '',
    component: ProductPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    IonicSelectableModule,
    IonicTimepickerModule
  ],
  declarations: [ProductPage]
})
export class ProductPageModule {}
