import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigurationComponent } from './configuration.component';

const routes: Routes = [
  { path: ' ', component: ConfigurationComponent },
  // { path: 'common_config', loadChildren: () => import('./common-config/common-config.module').then(m => m.CommonConfigModule)}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule { }
