import { Injectable, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { environment } from './../../../environments/environments';

import { AuthStatus, CheckToken, Login, Register, User } from '../interfaces';

@Injectable({
	providedIn: 'root'
})
export class AuthService {

	private readonly baseUrl: string = environment.baseUrl;
	private http: HttpClient = inject (HttpClient);

	private _currentUser: WritableSignal<User | null> = signal<User | null> (null);
	private _authStatus: WritableSignal<AuthStatus> = signal<AuthStatus> (AuthStatus.checking);

	public currentUser: Signal<User | null>	= computed (() => this._currentUser ());
	public authStatus: Signal<AuthStatus>	= computed (() => this._authStatus ());

	private setAuthentication (user: User, token: string): boolean {
		this._currentUser.set (user);
		this._authStatus.set (AuthStatus.authenticated);
		localStorage.setItem ('token', token);

		return true;
	}

	constructor () {
		this.checkAuthStatus ().subscribe ();
	}

	register (newUser: Register): Observable<boolean> {
		const { email, name, password } = newUser;
		const url	= `${ this.baseUrl }/auth/register`;
		const body	= { email, name, password };
		return this.http.post<Login> (`${ url }`, body).pipe (
			map (({ user, token }) => this.setAuthentication (user, token)),
			catchError (err => throwError (() => err.error.message)),
		);
	}

	login (email: string, password: string): Observable<boolean> {
		const url	= `${ this.baseUrl }/auth/login`;
		const body	= { email, password };
		return this.http.post<Login> (`${ url }`, body).pipe (
			map (({ user, token }) => this.setAuthentication (user, token)),
			catchError (err => throwError (() => err.error.message)),
		);
	}

	logout () {
		this._currentUser.set (null);
		this._authStatus.set (AuthStatus.notAuthenticated);
		localStorage.removeItem ('token');
	}

	checkAuthStatus (): Observable<boolean> {
		const url	= `${ this.baseUrl }/auth/check-token`;
		const token = localStorage.getItem ('token');
		if (!token) {
			this.logout ();
			return of (false);
		}

		const headers: HttpHeaders = new HttpHeaders ()
		.set ('Authorization', `Bearer ${ token }`);
		return this.http.get<CheckToken> (url, { headers }).pipe (
			map (({ user, token }) => this.setAuthentication (user, token)),
			catchError (() => {
				this._authStatus.set (AuthStatus.notAuthenticated);
				return of (false);
			}),
		);
	}
}