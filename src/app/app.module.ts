import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { routes, AppRoutes } from './app.routes';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimengMaterialUiModule } from './shared/primeng.material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { PasswordModule } from 'primeng/password';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { SpeedDialModule } from 'primeng/speeddial';
import { LocationStrategy, HashLocationStrategy, DatePipe } from '@angular/common';
import { StudentManagementInterceptor } from './shared/studentmanagementinterceptor';
import { ChangePasswordComponent } from './authentication/change-password/change-password.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { LoginComponent } from './authentication/login/login.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { MainmenuComponent } from './layout/mainmenu/mainmenu.component';
import { MenuComponent } from './layout/menu/menu.component';
import { MessageService } from 'primeng/api';
import { AuthenticationService } from './authentication/service/authentication.service';
import { AuthGuard } from './shared/auth/authguard.service';
import { CommonHttpService } from './shared/common-http.service';
import { CommonComponent } from './shared/common.component';
import { CommonFunctionsService } from './shared/commonfunction.service';
import { EncryptDecryptService } from './shared/encrypt-decrypt.service';

export function httpLoaderFactory(httpClient: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    ChangePasswordComponent,
    ForgotPasswordComponent,
    LoginComponent,
    FooterComponent,
    HeaderComponent,
    MainmenuComponent,
    MenuComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
    AppRoutes,
    FormsModule,
    ReactiveFormsModule,
    PrimengMaterialUiModule,
    BrowserAnimationsModule,
    NgxSpinnerModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      },
      isolate: true
    }),
    TranslateModule,
    HttpClientModule,
    PasswordModule,
    ScrollPanelModule,
    OrganizationChartModule,
    SpeedDialModule
  ],
  providers: [AuthGuard, MessageService, TranslateService, CommonFunctionsService, CommonHttpService, EncryptDecryptService, CommonComponent, DatePipe, AuthenticationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: StudentManagementInterceptor,
      multi: true
    },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
})
export class AppModule { }
