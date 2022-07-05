import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Room} from '../../../model/Room';
import {Router} from '@angular/router';
import {DataService} from '../../../data.service';
import {AuthService} from '../../../auth.service';

@Component({
  selector: 'app-room-detail',
  templateUrl: './room-detail.component.html',
  styleUrls: ['./room-detail.component.scss']
})
export class RoomDetailComponent implements OnInit {
  @Input()
  room: Room;
  @Output()
  dataChangeDetailEvent = new EventEmitter();
  message = '';
  loadData = false;
  isAdminUser = false;

  constructor(private router: Router,
              private dataService: DataService,
              private authService: AuthService) { }

  ngOnInit(): void {
    if (this.authService.role === 'ADMIN'){
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
  editRoom() {
    this.router.navigate(['admin', 'rooms'], {queryParams: {action: 'edit', id: this.room.id}});
  }

  // tslint:disable-next-line:typedef
  deleteRoom() {
    const result = confirm('Are you want to delete this room ?');
    if (result) {
     this.message = 'Deleting ...';
     this.dataService.deleteRoom(this.room.id).subscribe(
      next => {
         this.dataChangeDetailEvent.emit();
         this.router.navigate(['admin', 'rooms']);
        }, error => {
          this.message = 'Something wrong';
       }
      );
    }
  }
}
