import { Component, OnInit } from '@angular/core';
import {DataService} from '../../data.service';
import {Room} from '../../model/Room';
import {ActivatedRoute, Router} from '@angular/router';
import {FormResetService} from '../../form-reset.service';
import {AuthService} from '../../auth.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit {
  rooms: Array<Room>;
  selectedRoom: Room;
  action: string;
  loadingData = true;
  message = 'Please wait for data...';
  reloadAttemps = 0;
  isAdminUser = false;
  constructor(private dataService: DataService,
              private route: ActivatedRoute,
              private router: Router,
              private formResetService: FormResetService,
              private authService: AuthService) { }


  // tslint:disable-next-line:typedef
   loadData() {
     this.dataService.getRooms().subscribe(
       (next) => {
         this.rooms = next;
         this.loadingData = false;
         this.processUrlParamsFromRoom();
       },
       (error) => {
         if (error.status === 402) {
           this.message = 'Sorry - you need to pay ' + error.message;
         } else {
           this.reloadAttemps++;
           if (this.reloadAttemps <= 10) {
             this.message = 'Sorry - something went wrong. Try again ' + error.message;
             this.loadData();
           } else {
                this.message = 'Sorry - something wrong. We trying to fix this problem' + error.message;
           }
         }
       }
     );
   }

  // tslint:disable-next-line:typedef
   processUrlParamsFromRoom() {
     this.route.queryParams.subscribe((params) => {
         const id = params.id;
         this.action = null;
         if (id) {
           this.selectedRoom = this.rooms.find(room => {return room.id === +id;
           });
           this.action = params.action;
         }
         if (params.action === 'add') {
           this.selectedRoom = new Room();
           this.action = 'edit';
           this.formResetService.resetRoomFormEvent.emit(this.selectedRoom);
         }
       }
     );
   }
  ngOnInit(): void {
    this.loadData();
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
  setRoom(id: number) {
   this.router.navigate(['admin', 'rooms'], {queryParams: {id, action: 'view'}});  // {queryParams: {id : id}
  }
  // tslint:disable-next-line:typedef
  addRoom() {
    this.router.navigate(['admin', 'rooms'], {queryParams: { action: 'add'}});  // {queryParams: {id : id}

  }
}
