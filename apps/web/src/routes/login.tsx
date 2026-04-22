import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LoginForm } from "../features/auth/components";

export const Route = createFileRoute("/login")({
	component: Login,
});

function Login() {
	const navigate = useNavigate();

	return (
		<div className="flex h-screen flex-col items-center justify-center gap-4">
			<LoginForm onSuccess={() => navigate({ to: "/" })} />
			<div>
				まだアカウントをお持ちでないですか？{" "}
				<Link to="/signup" className="text-blue-500 hover:underline">
					サインアップ
				</Link>
			</div>
		</div>
	);
}
