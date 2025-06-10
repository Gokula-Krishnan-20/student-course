import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { NgxEchartsModule } from 'ngx-echarts';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(NgxEchartsModule.forRoot({ echarts: () => import('echarts') })),
    provideHttpClient() // ✅ Fixed: no extra array
  ]
};
