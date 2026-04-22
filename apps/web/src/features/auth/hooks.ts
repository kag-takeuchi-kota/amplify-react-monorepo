import { useState, useEffect } from "react";
import type { User } from "@repo/adapter";
import { auth } from "./client";

export function useCurrentUser() {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			const u = await auth.getUser();
			setUser(u);
			setIsLoading(false);
		};

		void fetchUser();
	}, []);

	return { user, isLoading };
}

export function useLogout() {
	const [isLoading, setIsLoading] = useState(false);

	const logout = async () => {
		setIsLoading(true);
		try {
			await auth.logout();
		} finally {
			setIsLoading(false);
		}
	};

	return { logout, isLoading };
}
