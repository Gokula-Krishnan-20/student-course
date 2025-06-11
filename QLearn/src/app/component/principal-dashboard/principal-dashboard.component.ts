// principal-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { NgxEchartsDirective } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { BarChart, PieChart, LineChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { EChartsCoreOption } from 'echarts';
import { Router } from '@angular/router';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { PrincipalServiceService } from '../../service/principal-service.service';
import { HttpClientModule } from '@angular/common/http';
import { NavAdminComponent } from "../nav-admin/nav-admin.component";

echarts.use([
  BarChart,
  PieChart,
  LineChart,
  GridComponent,
  CanvasRenderer,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
]);

@Component({
  selector: 'app-principal-dashboard',
  standalone: true,
  imports: [
    NgxEchartsDirective,
    CommonModule,
    MatDialogModule,
    HttpClientModule,
    NavAdminComponent
],
  templateUrl: './principal-dashboard.component.html',
  styleUrl: './principal-dashboard.component.css',
})
export class PrincipalDashboardComponent implements OnInit {
  chartOption!: EChartsCoreOption;
  popularCourseChart!: EChartsCoreOption;
  courseChart!: EChartsCoreOption;
  ratingChart!: EChartsCoreOption;
  completionChart!: EChartsCoreOption;

  roles: string | null = '';
  totalCourses: number = 0;
  totalInstructors: number = 0;
  Students: number = 0;
  allDepartments: number = 0;

  titles: string[] = [];
  ratings: number[] = [];
  recommendedCourses: any[] = [];

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private service: PrincipalServiceService
  ) {}
  couName: any;
  totalStudents: any[] = [];
  chartType: string = 'bar';
  chartOptions: any = {};
  cs = 0;
  it = 0;
  ec = 0;
  mech = 0;
totalEnrolledCourses:number = 0;
  recommendedCourse: any;
  ngOnInit(): void {
    this.roles = localStorage.getItem('role');
    console.log('User Role:', this.roles);

    this.service.getInstructor().subscribe((data: any) => {
      this.totalInstructors = data.length;
    });

    this.service.getStudents().subscribe((data: any) => {
      this.Students = data.length;
      for (let student of data) {
        if (student.department === 'Computer Science') this.cs++;
        else if (student.department === 'Information Technology') this.it++;
        else if (student.department === 'Electronics') this.ec++;
        else if (student.department === 'Mechanical') this.mech++;
      }
      this.setChart();

      this.totalEnrolledCourses = data.reduce((total: number, student: any) => {
    return total + (student.enrolledCourses?.length || 0);
  }, 0);

    });

    this.service.getCourses().subscribe((data: any[]) => {
      this.totalCourses = data.length;
      this.couName = data.map((c) => c.courseName);
      this.allDepartments = data.length
      console.log(this.couName);
      this.service.getCourses().subscribe((courses: any[]) => {
        this.recommendedCourse = courses.sort(
          (a: any, b: any) =>
            new Date(a.enrollPeriod.startDate).getTime() -
            new Date(b.enrollPeriod.startDate).getTime()
        )[0];
      });
    });

    AOS.init();
  }

  setChart(): void {
    const labels = [
      'Computer Science',
      'Information Technology',
      'Electronics',
      'Mechanical',
    ];
    const values = [this.cs, this.it, this.ec, this.mech];

    if (this.chartType === 'pie') {
      this.chartOptions = {
        title: { text: 'Students by Department', left: 'center' },
        tooltip: { trigger: 'item' },
        legend: { orient: 'vertical', left: 'left' },
        series: [
          {
            name: 'Departments',
            type: 'pie',
            radius: '50%',
            data: [
              { value: this.cs, name: 'Computer Science' },
              { value: this.it, name: 'Information Technology' },
              { value: this.ec, name: 'Electronics' },
              { value: this.mech, name: 'Mechanical' },
            ],
          },
        ],
      };
    } else {
      this.chartOptions = {
        title: { text: 'Students by Department' },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: labels },
        yAxis: { type: 'value' },
        series: [
          {
            data: values,
            type: this.chartType,
            label: { show: true },
          },
        ],
      };
    }
  }

  changeChart(type: string): void {
    this.chartType = type;
    this.setChart();
  }
}