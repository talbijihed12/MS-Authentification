import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public focus;
  email!:string;
  loggedIn: boolean = false;

  public listTitles: any[];
  public location: Location;
  constructor(location: Location,  private element: ElementRef, private router: Router,private loginService:AuthService) {
    this.location = location;
  }

  ngOnInit() {
    this.listTitles = ROUTES.filter(listTitle => listTitle);
    this.checkLoggedInStatus();
  }
  getTitle(){
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if(titlee.charAt(0) === '#'){
        titlee = titlee.slice( 1 );
    }

    for(var item = 0; item < this.listTitles.length; item++){
        if(this.listTitles[item].path === titlee){
            return this.listTitles[item].title;
        }
    }
    return 'Dashboard';
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
