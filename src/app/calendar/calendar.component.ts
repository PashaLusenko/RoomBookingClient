import {Component, OnInit} from '@angular/core';
import {Booking} from '../model/Booking';
import {DataService} from '../data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {formatDate} from '@angular/common';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  bookings: Array<Booking>;
  selectedDate: string;
  dataLoaded = false;
  message = '';
  isAdminUser = false;


  constructor(private dataService: DataService,
              private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.loadBookingData();
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
  loadBookingData() {
    this.message = 'Loading data...';
    this.route.queryParams.subscribe(
      params => {
        this.selectedDate = params.date;
        if (!this.selectedDate){
          this.selectedDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-GB');
        }
        this.dataService.getBookings(this.selectedDate).subscribe(
          next => {
            this.bookings = next;
            this.dataLoaded = true;
            this.message = '';
          }, error => this.message = 'Sorry, data could not loading'
        );
      }
    );
  }
  // tslint:disable-next-line:typedef
  editBooking(id: number) {
    this.router.navigate(['editBooking'], {queryParams: {id}});
  }
  // tslint:disable-next-line:typedef
  addBooking() {
    this.router.navigate(['addBooking']);
  }
  // tslint:disable-next-line:typedef
  deleteBooking(id: number) {
const result = confirm('Are you to delete booking?');
if (result) {
    this.message = 'deleting';
    this.dataService.deleteBooking(id).subscribe(
      next => {
        this.message = '';
        this.loadBookingData();
      },
      error => {
        this.message = 'deleting error';
      }
    );
   }
  }

  // tslint:disable-next-line:typedef
  dateChanged() {
    this.router.navigate([''], {queryParams: {date: this.selectedDate}});
  }
}
