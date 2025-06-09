import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideEchartsCore } from 'ngx-echarts'; // ✅ Import this
import * as echarts from 'echarts'; // ✅ Import ECharts

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), provideHttpClient(),
    provideEchartsCore({ echarts })
  ],
});
