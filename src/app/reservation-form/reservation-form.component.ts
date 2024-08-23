import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReservationService } from '../reservation/reservation.service';
import { Reservation } from '../models/reservation';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.css']
})
export class ReservationFormComponent implements OnInit {


  reservationForm: FormGroup = new FormGroup({});

  constructor(private formBuilder: FormBuilder,
    private reservationService: ReservationService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.reservationForm = this.formBuilder.group({
      checkInDate: ['', Validators.required],
      checkOutDate: ['', Validators.required],
      guestName: ['', Validators.required],
      guestEmail: ['', [Validators.required, Validators.email]],
      roomNumber: ['', Validators.required],
    });

    let id = this.activatedRoute.snapshot.paramMap.get('id');

    if (id) {
      // Update
      this.reservationService.getReservation(id).subscribe(reservation => {
        if (reservation) {
          console.log(">>>>>>>>>>", reservation);
          this.reservationForm.patchValue(reservation);
        }
      });


    }
  }

  onSubmit() {
    if (this.reservationForm.valid) {
      console.log("valid");
      let reservation: Reservation = this.reservationForm.value;

      //snapshot (currect value)
      let id = this.activatedRoute.snapshot.paramMap.get('id');

      if (id) {
        this.reservationService.updateRservation(id, reservation).subscribe(() => {
          console.log("Update req process");
        })
      } else {
        //New
        this.reservationService.addReservation(reservation).subscribe(() => {
          console.log("create req process");
        })
      }

      this.router.navigate(['/list']);
    }
  }

}
