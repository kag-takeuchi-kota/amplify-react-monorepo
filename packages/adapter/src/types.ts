export type User = {
	userId: string;
	name: string;
};

export interface AuthClient {
	login(email: string, password: string): Promise<User>;
	logout(): Promise<void>;
	signUp(email: string, password: string): Promise<void>;
	resendSignUpCode(email: string): Promise<void>;
	confirmSignUp(email: string, code: string): Promise<void>;
	getUser(): Promise<User | null>;
}
