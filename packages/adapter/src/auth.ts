import {
	signIn,
	signOut,
	signUp,
	confirmSignUp,
	resendSignUpCode,
	getCurrentUser,
} from "aws-amplify/auth";
import type { AuthClient, User } from "./types";

export class AmplifyAuthClient implements AuthClient {
	async login(email: string, password: string): Promise<User> {
		const signInOut = await signIn({
			username: email,
			password,
		});
		if (!signInOut.isSignedIn) {
			throw new Error("Login failed");
		}
		const challenge = signInOut.nextStep.signInStep;
		if (challenge !== "DONE") {
			throw new Error(`Unsupported challenge: ${challenge}`);
		}

		const user = await getCurrentUser();
		return {
			userId: user.userId,
			name: user.username,
		};
	}

	async logout(): Promise<void> {
		await signOut({
			global: true,
		});
	}

	async signUp(email: string, password: string): Promise<void> {
		await signUp({
			username: email,
			password,
		});
	}

	async resendSignUpCode(email: string): Promise<void> {
		await resendSignUpCode({ username: email });
	}

	async confirmSignUp(email: string, code: string): Promise<void> {
		const confirmResult = await confirmSignUp({
			confirmationCode: code,
			username: email,
		});
		if (!confirmResult.isSignUpComplete) {
			throw new Error("Confirmation failed");
		}
	}

	async getUser(): Promise<User | null> {
		try {
			const user = await getCurrentUser();
			if (!user) {
				return null;
			}
			return {
				userId: user.userId,
				name: user.username,
			};
		} catch (error) {
			console.warn("Failed to get current user", error);
			return null;
		}
	}
}
