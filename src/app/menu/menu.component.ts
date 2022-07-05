import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  userIsLoggedIn = false;

  constructor(private router: Router,
              private authService: AuthService) { }
  ngOnInit(): void {
    if (this.authService.isAuthenticated) {
      this.userIsLoggedIn = true;
    }
    this.authService.authenticationResultEvent.subscribe(
      next => this.userIsLoggedIn = next);
  }

  // tslint:disable-next-line:typedef
  navigateToRoomsAdmin() {
    this.router.navigate(['admin', 'rooms']);
  }

  // tslint:disable-next-line:typedef
  navigateToUsersAdmin() {
    this.router.navigate(['admin', 'users']);
  }

  // tslint:disable-next-line:typedef
  navigateToHome() {
    this.router.navigate(['']);
  }

  // tslint:disable-next-line:typedef
  logout() {
    this.authService.logout();
    this.navigateToHome();
  }
}
