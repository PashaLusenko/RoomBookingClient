import { Component, OnInit } from '@angular/core';
import {User} from '../../model/User';
import {DataService} from '../../data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormResetService} from '../../form-reset.service';
import {AuthService} from '../../auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: Array<User>;
  selectedUser: User;
  action: string;
  message = 'Loading data...please wait';
  loadingData = true;
  isAdminUser = false;

  constructor(private dataService: DataService,
              private router: Router,
              private route: ActivatedRoute,
              private formResetService: FormResetService,
              private authService: AuthService) { }

  ngOnInit(): void {
   this.loadDataFromUser();
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
  loadDataFromUser() {
    this.dataService.getUsers().subscribe((next) => {
        this.users = next;
        this.loadingData = false;
        this.processUrlParamsFromUser();
      }, error => {
        this.message = 'The error occured - please contact support';
      }
    );
  }

  // tslint:disable-next-line:typedef
  processUrlParamsFromUser() {
    this.route.queryParams.subscribe((param) => {
        const id = param.id;
        this.action = param.action;
        if (id) {
          this.selectedUser = this.users.find(user => user.id === +id);
        }
      }
    );
  }
  // tslint:disable-next-line:typedef
  setUser(id: number) {
    this.router.navigate(['admin', 'users'], {queryParams: {id, action: 'view'}});
  }

  // tslint:disable-next-line:typedef
  addUser() {
    this.selectedUser = new User();
    this.router.navigate(['admin', 'users'], {queryParams: {action: 'add'}});
    this.formResetService.resetUserFormEvent.emit(this.selectedUser);
  }
}
