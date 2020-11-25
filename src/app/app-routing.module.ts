import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './pages/dashboard/dashboard.module#DashboardPageModule' },
  { path: 'home', loadChildren: './pages/dashboard/dashboard.module#DashboardPageModule'},
  { path: 'dashboard', loadChildren: './pages/dashboard/dashboard.module#DashboardPageModule' },
  { path: 'dockets', loadChildren: './pages/dockets/dockets.module#DocketsPageModule' },
  { path: 'employees', loadChildren: './modal/employees/employees.module#EmployeesPageModule' },
  { path: 'product', loadChildren: './modal/product/product.module#ProductPageModule' },
  { path: 'das-edit', loadChildren: './modal/das-edit/das-edit.module#DasEditPageModule' },
  { path: 'employee-edit', loadChildren: './modal/employee-edit/employee-edit.module#EmployeeEditPageModule' },
  { path: 'product-edit', loadChildren: './modal/product-edit/product-edit.module#ProductEditPageModule' }
  // { path: 'workorder', loadChildren: './modal/workorder/workorder.module#WorkorderPageModule' },
  // { path: 'das', loadChildren: './modal/das/das.module#DasPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
