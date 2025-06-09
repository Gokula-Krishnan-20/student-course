import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import * as AOS from 'aos';
import 'aos/dist/aos.css';
import { NavbarComponent } from "./student/component/navbar/navbar.component";
// import { CourseListComponent } from "./student/components/course-list/course-list.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'QLearn';
  

  ngOnInit() {
    AOS.init({ duration: 800 });
  }

}
