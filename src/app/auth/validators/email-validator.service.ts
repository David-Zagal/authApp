import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable, delay } from 'rxjs';

@Injectable({providedIn: 'root'})
export class EmailValidatorService implements AsyncValidator {

	validate (control: AbstractControl): Observable<ValidationErrors | null> {
		const email = control.value;
		const httpCallObservable = new Observable<ValidationErrors | null> ((suscriber) => {
			if (email === 'david@gmail.com') {
				suscriber.next ({ emailTaken: true, });
				suscriber.complete ();
				// return;
			}
			suscriber.next (null);
			suscriber.complete ();
		}).pipe (delay (2000));

		return httpCallObservable;
	}

	// COMO SE USARIA EN WEB
	// validate (control: AbstractControl): Observable<ValidationErrors | null> {
	// 	return this.http.get <string> (`http://localhost:3000/users?q=${ email }`).pipe (
	// 		map (resp => {
	// 			return (resp.length === 0) ? null : { emailTaken: true, };
	// 		})
	// 	);
	// }
}