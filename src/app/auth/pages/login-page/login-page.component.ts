import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { AuthService, ValidatorsService } from './../../services';
import { EmailValidatorService } from '../../validators/email-validator.service';

@Component({
	selector: 'auth-login-page',
	templateUrl: './login-page.component.html',
	styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {

	private fb: FormBuilder = inject (FormBuilder);
	private authService: AuthService = inject (AuthService);
	private router: Router = inject (Router);
	private validatorsService: ValidatorsService = inject (ValidatorsService);
	private emailValidatorService: EmailValidatorService = inject (EmailValidatorService);

	public myForm: FormGroup = this.fb.group ({
		email:		['davida@gmail.com', [Validators.required, Validators.pattern (this.validatorsService.emailPattern)], [this.emailValidatorService]],
		password:	['123456', [Validators.required, Validators.minLength (6)]],
	});

	login (): void {
		const { email, password } = this.myForm.value
		this.authService.login (email, password).subscribe ({
			next: () => this.router.navigateByUrl ('/dashboard'),
			error: (message) => {
				Swal.fire ('Error ', message, 'error');
			},
		});
		// this.authService.login (this.myForm.controls['email'].value, this.myForm.controls['password'].value);
	}
}