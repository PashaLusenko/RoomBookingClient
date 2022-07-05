import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from '../../../model/User';
import {DataService} from '../../../data.service';
import {Router} from '@angular/router';
import {AuthService} from '../../../auth.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

  @Input()
  user: User;
  @Output()
  dataChangeUserEvent = new EventEmitter();
  message = '';
  isAdminUser = false;
  constructor(private dataService: DataService,
              private router: Router,
              private authService: AuthService) {}

  ngOnInit(): void {
    if (this.authService.role === 'ADMIN') {
      this.isAdminUser = true;
    }
    this.authService.roleSetEvent.subscribe(
      next => {
        if (next === 'ADMIN'){
          this.isAdminUser = true;
        } else {
          this.isAdminUser = false;
        }
      }
    );
  }

  // tslint:disable-next-line:typedef
  editUser() {
  this.router.navigate(['admin', 'users'], {queryParams: {action: 'edit', id: this.user.id}});
  }
  // tslint:disable-next-line:typedef
  deleteUser() {
    const result = confirm('Are you sure you wish to delete this user?');
    if (result) {
      this.message = 'deleting...';
      this.dataService.deleteUser(this.user.id).subscribe(
        next => {
          this.dataChangeUserEvent.emit();
          this.router.navigate(['admin', 'users']);
        }, error => this.message = 'Sorry, this user cannot be deleted at this time.'
      );
    }
  }
  // tslint:disable-next-line:typedef
  resetPasswords() {
    this.message = 'please wait...';
    this.dataService.resetUserPassword(this.user.id).subscribe(
      next => this.message = 'password reset',
      error => this.message = 'password not reset'
    );
  }
}
