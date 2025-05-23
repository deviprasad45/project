import { ModuleWithProviders } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ChangePasswordComponent } from "./authentication/change-password/change-password.component";
import { ForgotPasswordComponent } from "./authentication/forgot-password/forgot-password.component";
import { LoginComponent } from "./authentication/login/login.component";
import { MainmenuComponent } from "./layout/mainmenu/mainmenu.component";
import { AuthGuard } from "./shared/auth/authguard.service";

export const routes: Routes = [

    { path: '', component: LoginComponent },

    {
        path: 'menu', component: MainmenuComponent,
        children: [
            { path: 'configurations', loadChildren: () => import('./configurations/configuration.module').then(m => m.ConfigurationModule), canActivate: [AuthGuard] }
        ]
    },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'change_password', component: ChangePasswordComponent },
]
export const AppRoutes: ModuleWithProviders<any> = RouterModule.forRoot(routes);