import { Routes } from '@angular/router';
import { CustomersComponent } from './customers/customers.component';
import { PropertiesComponent } from './properties/properties.component';

export const routes: Routes = [
  { path: '', redirectTo: '/properties', pathMatch: 'full' },
  { path: 'customers', component: CustomersComponent },
  { path: 'properties', component: PropertiesComponent }
];
