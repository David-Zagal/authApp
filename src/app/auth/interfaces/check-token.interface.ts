import { User } from "./user.interface";

export interface CheckToken {
	user: User;
	token: string;
}