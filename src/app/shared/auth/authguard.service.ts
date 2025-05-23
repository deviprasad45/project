import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CommonFunctionsService } from '../commonfunction.service';

@Injectable()
export class AuthGuard implements CanActivate {

    items: any[] = [];

    constructor(private router: Router, private commonFunctionsService: CommonFunctionsService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.commonFunctionsService.getUserFromSession() && this.commonFunctionsService.getAuthToken()) {
            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate([''], { queryParams: { returnUrl: state.url } });
            sessionStorage.clear();
        return false;
    }

}