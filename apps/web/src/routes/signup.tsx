import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SignUpForm } from "../features/auth/components";

export const Route = createFileRoute("/signup")({
	component: SignUp,
});

function SignUp() {
	const navigate = useNavigate();

	return (
		<div className="flex h-screen flex-col items-center justify-center gap-4">
			<SignUpForm onSuccess={() => navigate({ to: "/login" })} />
			<div>
				すでにアカウントをお持ちですか？{" "}
				<a href="/login" className="text-blue-500 hover:underline">
					ログイン
				</a>
			</div>
		</div>
	);
}
