import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { AuthService, ValidatorsService } from './../../services';
import { EmailValidatorService } from '../../validators/email-validator.service';
import { Register } from '../../interfaces';

@Component({
	selector: 'auth-register-page',
	templateUrl: './register-page.component.html',
	styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent {

	private fb: FormBuilder = inject (FormBuilder);
	private authService: AuthService = inject (AuthService);
	private router: Router = inject (Router);
	private validatorsService: ValidatorsService = inject (ValidatorsService);
	private emailValidatorService: EmailValidatorService = inject (EmailValidatorService);

	public myForm: FormGroup = this.fb.group ({
		email:		['davida@gmail.com', [Validators.required, Validators.pattern (this.validatorsService.emailPattern)], [this.emailValidatorService]],
		name:		['David', [Validators.required]],
		password:	['123456', [Validators.required, Validators.minLength (6)]],
		password2:	['123456', [Validators.required]],
	}, {
		validators: [
			this.validatorsService.isFieldOneEqualFieldTwo ('password', 'password2'),
		]
	});

	register (): void {
		const { email, name, password }: Register = this.myForm.value;
		const newUser: Register = { email, name, password };
		this.authService.register (newUser).subscribe ({
			next: () => this.router.navigateByUrl ('/dashboard'),
			error: (message) => {
				Swal.fire ('Error ', message, 'error');
			},
		});
	}
}