import { Component } from '@angular/core';
import * as AOS from 'aos';
import { NgxEchartsDirective } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { EChartsCoreOption } from 'echarts';
import { Router } from '@angular/router';
echarts.use([BarChart, GridComponent, CanvasRenderer]);

import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { PrincipalServiceService } from '../../service/principal-service.service';
import { HttpClientModule } from '@angular/common/http';
import { NavAdminComponent } from "../nav-admin/nav-admin.component";

@Component({
  selector: 'app-principal-dashboard',
  imports: [NgxEchartsDirective, CommonModule, MatDialogModule, HttpClientModule, NavAdminComponent],
  templateUrl: './principal-dashboard.component.html',
  styleUrl: './principal-dashboard.component.css'
})
export class PrincipalDashboardComponent {
  chartOption: EChartsCoreOption = {
    title: { text: 'Enrollment Summary by Course', left: 'center' },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    legend: { data: ['Students'], top: 30 },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'Biology']
    },
    yAxis: { type: 'value' },
    series: [{
      name: 'Students',
      type: 'bar',
      data: [120, 90, 60, 150, 70],
      itemStyle: { color: '#5470C6' }
    }]
  };

  constructor(private dialog: MatDialog, private router: Router, private service: PrincipalServiceService) {}

  chartOptions: any;
  courseChart: any;
  ratingChart: any;
  completionChart: any;

  role: string = '';
  viewAll: any;
  totalCourses: any;
  totalInstructors: any;
  totalStudents :any;
  approvedCourses: any;
  highRatedCourses: any;
  allDepartments: any;
  titles: any;
  ratings: any;

  instructorCourseChart: any;
  recommendedCourses: any;
  
roles:any
  ngOnInit() {

     this.roles = localStorage.getItem('role');
  console.log('User Role:', this.roles);
  
    this.service.getInstructor().subscribe((data: any) => {
      this.totalInstructors = data.length;
      console.log(this.totalInstructors);

    });

 this.service.getStudents().subscribe((students:any)=>{
this.totalStudents = students.length;
 })

  this.service.getCourses().subscribe((data: any[]) => {
    this.totalCourses = data.length;
    this.ratings = data.map(course => course.rating);
    this.recommendedCourses = data.filter(course => course.rating >= 3);
    this.titles = data.map(course => course.title);
    this.allDepartments = new Set(data.map(course => course.department)).size;
 
    

    // Populate courseChart dynamically by instructor
    const instructorCountMap: { [key: string]: number } = {};
    data.forEach(course => {
      const instructor = course.instructor || 'Unknown';
      instructorCountMap[instructor] = (instructorCountMap[instructor] || 0) + 1;
    });
    const instructorNames = Object.keys(instructorCountMap);
    const courseCounts = Object.values(instructorCountMap);

    this.courseChart = {
      title: { text: 'Courses Created per Instructor', left: 'center' },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: instructorNames },
      yAxis: { type: 'value' },
      series: [{
        type: 'bar',
        data: courseCounts,
        itemStyle: { color: '#42A5F5' }
      }]
    };

    AOS.init();

    this.chartOptions = {
      title: { text: 'Popular Courses', left: 'center' },
      tooltip: {},
      xAxis: { type: 'category', data: this.titles },
      yAxis: { type: 'value' },
      series: [{
        name: 'Ratings',
        type: 'bar',
        data: this.ratings,
        itemStyle: { color: '#4CAF50' }
      }]
    };

    // Group ratings by instructor and calculate average
    const instructorRatings: { [key: string]: number[] } = {};

    data.forEach((course: { instructor: string; rating: number; }) => {
      const instructor = course.instructor || 'Unknown';
      if (!instructorRatings[instructor]) instructorRatings[instructor] = [];
      instructorRatings[instructor].push(course.rating);
    });

    const avgInstructorNames = Object.keys(instructorRatings);
    const avgRatings = avgInstructorNames.map(name => {
      const ratings = instructorRatings[name];
      const total = ratings.reduce((a, b) => a + b, 0);
      return parseFloat((total / ratings.length).toFixed(2));
    });

    // Assign to ratingChart
    this.ratingChart = {
      title: { text: 'Average Ratings per Instructor', left: 'center' },
      xAxis: { type: 'category', data: avgInstructorNames },
      yAxis: { type: 'value', min: 0, max: 5 },
      series: [{
        type: 'line',
        data: avgRatings,
        itemStyle: { color: '#66BB6A' },
        smooth: true
      }]
    };
  });

  const userData = localStorage.getItem('user');
  if (userData) {
    const user = JSON.parse(userData);
    this.role = user.role;
  }

  this.completionChart = {
    title: { text: 'Course Completion Rate (%)', left: 'center' },
    tooltip: { trigger: 'item' },
    legend: { bottom: 0 },
    series: [{
      name: 'Completion Rate',
      type: 'pie',
      radius: '55%',
      data: [
        { value: 85, name: 'Alice' },
        { value: 70, name: 'Bob' },
        { value: 60, name: 'Charlie' },
        { value: 90, name: 'David' }
      ]
    }]
  };
}

  courses = [
    { title: 'Angular Basics', rating: 4.8, status: 'Approved', department: 'cse' },
    { title: 'Node.js Fundamentals', rating: 4.2, status: 'Approved' },
    { title: 'MongoDB Mastery', rating: 4.9, status: 'Approved' }
  ];
}
