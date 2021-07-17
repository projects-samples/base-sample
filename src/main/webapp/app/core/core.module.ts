import { NgModule, LOCALE_ID } from '@angular/core';
import { DatePipe, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import locale from '@angular/common/locales/en';

import {
    JhiTrackerService,
    WindowRef,
    JhiLanguageHelper,
    LoginService,
    LoginModalService,
    AccountService,
    StateStorageService,
    Principal,
    CSRFService,
    AuthServerProvider,
    UserService,
    UserRouteAccessService
} from './';
import { FindLanguageFromKeyPipe } from 'app/shared';
@NgModule({
    imports: [HttpClientModule],
    exports: [],
    declarations: [],
    providers: [
        JhiTrackerService,
        WindowRef,
        LoginService,
        LoginModalService,
        Title,
        {
            provide: LOCALE_ID,
            useValue: 'en'
        },
        FindLanguageFromKeyPipe,
        JhiLanguageHelper,
        AccountService,
        StateStorageService,
        Principal,
        CSRFService,
        AuthServerProvider,
        UserService,
        DatePipe,
        UserRouteAccessService
    ]
})
export class SpotGarageCoreModule {
    constructor() {
        registerLocaleData(locale);
    }
}
