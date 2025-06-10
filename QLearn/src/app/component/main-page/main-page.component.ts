import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-page',
  imports: [RouterOutlet],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {
logo = 'assets/images/logo.jpeg';
background = 'assets/images/background.jpg';
constructor(private router: Router) {}

log(){

  this.router.navigate(['/login']);
}
}
