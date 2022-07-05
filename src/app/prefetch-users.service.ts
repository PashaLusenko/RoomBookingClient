import { Injectable } from '@angular/core';
import {DataService} from './data.service';
import {Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {User} from './model/User';

@Injectable({
  providedIn: 'root'
})
export class PrefetchUsersService implements Resolve<Observable<Array<User>>>{

  constructor(private dataService: DataService) { }

  resolve() {
    return this.dataService.getUsers();
  }
}
