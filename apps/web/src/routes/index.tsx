import { Button } from "@repo/ui";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RequiredAuth } from "../features/auth/components";
import { useLogout } from "../features/auth/hooks";
import { tryExec } from "../features/error/error";

export const Route = createFileRoute("/")({
	component: () => (
		<RequiredAuth>
			<Home />
		</RequiredAuth>
	),
});

function Home() {
	const navigate = useNavigate();
	const { logout, isLoading: isLoggingOut } = useLogout();

	const handleLogout = async () => {
		await logout();
		await navigate({ to: "/login" });
	};

	return (
		<div>
			<h1>Hello, World!</h1>
			<Button variant="outline" onClick={handleLogout} disabled={isLoggingOut}>
				{isLoggingOut ? "ログアウト中..." : "ログアウト"}
			</Button>
			<Button
				variant="destructive"
				onClick={() => {
					void tryExec(
						() => {
							throw new Error("Something went wrong!");
						},
						{ displayMessage: "エラー発生！" },
					);
				}}
			>
				エラー発生ボタン
			</Button>
		</div>
	);
}
