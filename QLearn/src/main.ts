import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import 'aos/dist/aos.css'; // ✅ Import AOS CSS
import AOS from 'aos';
import * as echarts from 'echarts';
import { provideEchartsCore } from 'ngx-echarts';

// ✅ Initialize AOS here before bootstrap
AOS.init({
  duration: 1000,
  once: true
});

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), provideHttpClient(),
    provideEchartsCore({ echarts })
  ],
});
