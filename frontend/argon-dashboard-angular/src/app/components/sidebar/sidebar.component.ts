import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'ni-tv-2 text-primary', class: '' },
    { path: '/maps', title: 'Maps',  icon:'ni-pin-3 text-orange', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;
  email!:string;
  loggedIn: boolean = false;



  constructor(private router: Router,private loginService:AuthService) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });
  }
  onLogoutClicked() {
    window.localStorage.removeItem('access_token');
    window.localStorage.removeItem('refresh_token');
    this.router.navigate(['/login']);
}
checkLoggedInStatus(): void {
  this.loggedIn = this.loginService.isLoggedIn();

  if (this.loggedIn) {
    const username = this.loginService.getUsernameFromToken();
    console.log(username);
    if (username !== null) {
      this.email = username;
    } else {
      console.error('Username is not available');
    }
  } else {
    console.error('User is not logged in');
  }
}
}
