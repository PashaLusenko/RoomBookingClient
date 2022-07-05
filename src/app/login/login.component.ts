import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  message = '';
  name: string;
  password: string;
  subscription: Subscription;

  constructor(private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.subscription = this.authService.authenticationResultEvent.subscribe(
      result => {
        if (result) {
          const url = this.route.snapshot.queryParams.requested;
          this.router.navigateByUrl(url);
        }else {
          this.message = 'Not correct password or name';
        }
      }
    );
    this.authService.checkIfAlreadyAuthenticated();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // tslint:disable-next-line:typedef
  onSubmit() {
    this.authService.authenticate(this.name, this.password);
  }
}
