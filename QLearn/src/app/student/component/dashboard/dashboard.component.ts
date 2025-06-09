import { Component, OnInit } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { StudentService } from '../../services/student.service';
import { Student } from '../../model/student.model';
import * as echarts from 'echarts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgxEchartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  student!: Student;
  avatarUrl!: string;

  courseCompletionOptions: any;
  dailyLearningOptions: any;
  departmentChartOptions: any;
  topCoursesOptions: any;

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
  this.studentService.getStudent().subscribe({
    next: (data) => {
      if (data) {
        this.student = data;
        this.avatarUrl = this.generateAvatarUrl(this.student?.name ?? 'Student');
        this.initCharts();
      }
    },
    error: (err) => {
      console.error('Error fetching student data:', err);
    }
  });
}

generateAvatarUrl(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff&size=100&rounded=true`;
}

  initCharts(): void {
    const completedCourses = this.student.progress.length;
    const totalCourses = this.student.enrolledCourses.length;

    this.courseCompletionOptions = {
      title: { text: 'Course Completion' },
      tooltip: {},
      xAxis: { data: ['Completed', 'Remaining'] },
      yAxis: {},
      series: [{
        name: 'Courses',
        type: 'bar',
        data: [completedCourses, totalCourses - completedCourses],
        itemStyle: {
          color: (params: any) =>
            params.name === 'Completed' ? '#28a745' : '#dc3545',
        }
      }]
    };

    this.dailyLearningOptions = {
      title: { text: 'Daily Learning Progress', left: 'center' },
      xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
      yAxis: { type: 'value', max: 100 },
      series: [{
        data: [10, 30, 60, 80, 90],
        type: 'line',
        areaStyle: {},
        smooth: true
      }]
    };

    this.departmentChartOptions = {
      title: { text: 'Department Distribution', left: 'center' },
      series: [{
        name: 'Department',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 1, name: this.student.department },
          { value: 3, name: 'Others' }
        ]
      }]
    };

    this.topCoursesOptions = {
      title: { text: 'My Enrolled Courses' },
      tooltip: {},
      xAxis: {
        type: 'category',
        data: this.student.enrolledCourses
      },
      yAxis: {
        type: 'value',
      },
      series: [{
        data: this.student.enrolledCourses.map(() => Math.floor(Math.random() * 100)),
        type: 'bar',
        itemStyle: {
          color: '#007bff'
        }
      }]
    };
  }
}
