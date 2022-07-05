import {Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Layout, LayoutCapacity, Room} from '../../../model/Room';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {DataService} from '../../../data.service';
import {Router} from '@angular/router';
import {FormResetService} from '../../../form-reset.service';
import {Subscription} from 'rxjs';
import {AuthService} from '../../../auth.service';

@Component({
  selector: 'app-room-edit',
  templateUrl: './room-edit.component.html',
  styleUrls: ['./room-edit.component.scss']
})
export class RoomEditComponent implements OnInit, OnDestroy {
  @Input()
  room: Room;
  @Output()
  dataChangeRoomEvent = new EventEmitter();
  message = '';
  layouts = Object.keys(Layout);
  layoutEnum = Layout;

  roomForm: FormGroup;
  roomResetSubscription: Subscription;

  constructor(private formBuilder: FormBuilder,
              private dataService: DataService,
              private router: Router,
              private formResetService: FormResetService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.initializeForm();
    this.roomResetSubscription = this.formResetService.resetRoomFormEvent.subscribe(
      room => {
        this.room = room;
        this.initializeForm();
      }
    );
  }

  // tslint:disable-next-line:typedef
  initializeForm() {
    this.roomForm = this.formBuilder.group({
      roomName: [this.room.name, Validators.required],
      location: [this.room.location, [Validators.required, Validators.minLength(2)]]
    });

    for (const layout of this.layouts) {
      const layoutCapacity = this.room.capacities.find(lc => lc.layout === Layout[layout]);
      const initialCapacity = layoutCapacity == null ? 0 :  layoutCapacity.capacity;
      this.roomForm.addControl(`layout${layout}`, this.formBuilder.control(initialCapacity));
    }
  }
  // tslint:disable-next-line:typedef
  onSubmit() {
    this.message = 'Saving...';
    this.room.name = this.roomForm.controls.roomName.value;
    this.room.location = this.roomForm.value.location;
    this.room.capacities = new Array<LayoutCapacity>();
    for (const layout of this.layouts) {
      const layoutCapacity = new LayoutCapacity();
      layoutCapacity.layout = Layout[layout];
      layoutCapacity.capacity = this.roomForm.controls[`layout${layout}`].value;
      this.room.capacities.push(layoutCapacity);
    }
    if (this.room.id == null) {
      this.dataService.addRoom(this.room).subscribe(
        next => {
          this.dataChangeRoomEvent.emit();
          this.router.navigate(['admin', 'rooms'], {queryParams: {action: 'view', id: next.id}});
        }, error => this.message = 'Something went wrong'
      );
    } else {
      this.dataService.updateRoom(this.room).subscribe(
        next => {
          this.dataChangeRoomEvent.emit();
          this.router.navigate(['admin', 'rooms'], {queryParams: {action: 'view', id: next.id}});
        }, error => {
          this.message = 'Something went wrong';
        }
      );
    }
  }

  ngOnDestroy(): void {
    this.roomResetSubscription.unsubscribe();
  }

}
