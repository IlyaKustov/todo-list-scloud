import {APP_INITIALIZER, ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideIndexedDb} from 'ngx-indexed-db';
import { routes } from './app.routes';
import { dbConfig } from './services/model/dbConfig';
import {HttpClient, provideHttpClient} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {BsModalService} from 'ngx-bootstrap/modal';
import {StoreModule} from "@ngrx/store";
import {DbService} from './services/db.service';

const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http, './i18n/', '.json');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideIndexedDb(dbConfig),
    provideHttpClient(),
    importProvidersFrom([
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: httpLoaderFactory,
          deps: [HttpClient],
        },}),
      StoreModule.forRoot({}),
    ]),

    BsModalService,
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [BsModalService],
      useFactory: (bsModalService: BsModalService) => {
        return () => {
          bsModalService.config.animated = true;
          bsModalService.config.focus = true;
          bsModalService.config.ignoreBackdropClick = false;
          bsModalService.config.keyboard = true;
          bsModalService.config.class = "modal-xs";
        };
      }
    },
    DbService
  ],
};
