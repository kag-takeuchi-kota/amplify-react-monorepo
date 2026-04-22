import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import type { User } from "@repo/adapter";
import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Input,
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
	Label,
} from "@repo/ui";
import { Navigate, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { auth } from "./client";
import { useCurrentUser } from "./hooks";

const loginSchema = z.object({
	email: z.email("有効なメールアドレスを入力してください"),
	password: z.string().min(8, "パスワードは8文字以上である必要があります"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

type LoginFormProps = {
	onSuccess?: (user: User) => void;
};

export function LoginForm({ onSuccess }: LoginFormProps) {
	const [serverError, setServerError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormValues>({
		resolver: standardSchemaResolver(loginSchema),
	});

	const onSubmit = async ({ email, password }: LoginFormValues) => {
		setServerError(null);
		try {
			const user = await auth.login(email, password);
			onSuccess?.(user);
		} catch (err) {
			setServerError(
				err instanceof Error ? err.message : "ログインに失敗しました",
			);
		}
	};

	return (
		<Card className="w-full max-w-sm">
			<CardHeader>
				<CardTitle>ログイン</CardTitle>
				<CardDescription>
					メールアドレスとパスワードを入力してください
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="email">メールアドレス</Label>
						<Input
							id="email"
							type="email"
							placeholder="example@example.com"
							autoComplete="email"
							aria-invalid={!!errors.email}
							{...register("email")}
						/>
						{errors.email && (
							<p className="text-sm text-destructive">{errors.email.message}</p>
						)}
					</div>
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="password">パスワード</Label>
						<Input
							id="password"
							type="password"
							placeholder="パスワード"
							autoComplete="current-password"
							aria-invalid={!!errors.password}
							{...register("password")}
						/>
						{errors.password && (
							<p className="text-sm text-destructive">
								{errors.password.message}
							</p>
						)}
					</div>
					{serverError && (
						<p className="text-sm text-destructive">{serverError}</p>
					)}
					<Button type="submit" disabled={isSubmitting} className="w-full">
						{isSubmitting ? "ログイン中..." : "ログイン"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}

const signUpSchema = z
	.object({
		email: z.email("有効なメールアドレスを入力してください"),
		password: z.string().min(8, "パスワードは8文字以上である必要があります"),
		confirmPassword: z.string().min(1, "パスワード（確認）を入力してください"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "パスワードが一致しません",
		path: ["confirmPassword"],
	});

type SignUpFormValues = z.infer<typeof signUpSchema>;

type SignUpFormProps = {
	onSuccess?: () => void;
};

export function SignUpForm({ onSuccess }: SignUpFormProps) {
	const navigate = useNavigate();
	const [pendingEmail, setPendingEmail] = useState<string | null>(null);
	const [serverError, setServerError] = useState<string | null>(null);
	const [otp, setOtp] = useState("");
	const [isConfirming, setIsConfirming] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SignUpFormValues>({
		resolver: standardSchemaResolver(signUpSchema),
	});

	const onSubmit = async ({ email, password }: SignUpFormValues) => {
		setServerError(null);
		try {
			await auth.signUp(email, password);
			setPendingEmail(email);
		} catch {
			// ユーザーが既に存在する場合（コード待ち状態）はコードを再送信する
			try {
				await auth.resendSignUpCode(email);
				setPendingEmail(email);
			} catch (resendErr) {
				setServerError(
					resendErr instanceof Error
						? resendErr.message
						: "サインアップに失敗しました",
				);
			}
		}
	};

	const handleOtpComplete = async (code: string) => {
		if (!pendingEmail) return;
		setServerError(null);
		setIsConfirming(true);
		try {
			await auth.confirmSignUp(pendingEmail, code);
			onSuccess?.();
			await navigate({ to: "/login" });
		} catch (err) {
			setServerError(err instanceof Error ? err.message : "確認に失敗しました");
			setOtp("");
		} finally {
			setIsConfirming(false);
		}
	};

	if (pendingEmail) {
		return (
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle>メール確認</CardTitle>
					<CardDescription>
						{pendingEmail} に届いた6桁のコードを入力してください
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col items-center gap-4">
						<InputOTP
							maxLength={6}
							value={otp}
							onChange={setOtp}
							onComplete={handleOtpComplete}
							disabled={isConfirming}
						>
							<InputOTPGroup>
								<InputOTPSlot index={0} />
								<InputOTPSlot index={1} />
								<InputOTPSlot index={2} />
								<InputOTPSlot index={3} />
								<InputOTPSlot index={4} />
								<InputOTPSlot index={5} />
							</InputOTPGroup>
						</InputOTP>
						{serverError && (
							<p className="text-sm text-destructive">{serverError}</p>
						)}
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="w-full max-w-sm">
			<CardHeader>
				<CardTitle>サインアップ</CardTitle>
				<CardDescription>
					メールアドレスとパスワードを入力してください
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="signup-email">メールアドレス</Label>
						<Input
							id="signup-email"
							type="email"
							placeholder="example@example.com"
							autoComplete="email"
							aria-invalid={!!errors.email}
							{...register("email")}
						/>
						{errors.email && (
							<p className="text-sm text-destructive">{errors.email.message}</p>
						)}
					</div>
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="signup-password">パスワード</Label>
						<Input
							id="signup-password"
							type="password"
							placeholder="8文字以上"
							autoComplete="new-password"
							aria-invalid={!!errors.password}
							{...register("password")}
						/>
						{errors.password && (
							<p className="text-sm text-destructive">
								{errors.password.message}
							</p>
						)}
					</div>
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="signup-confirm-password">パスワード（確認）</Label>
						<Input
							id="signup-confirm-password"
							type="password"
							placeholder="パスワードを再入力"
							autoComplete="new-password"
							aria-invalid={!!errors.confirmPassword}
							{...register("confirmPassword")}
						/>
						{errors.confirmPassword && (
							<p className="text-sm text-destructive">
								{errors.confirmPassword.message}
							</p>
						)}
					</div>
					{serverError && (
						<p className="text-sm text-destructive">{serverError}</p>
					)}
					<Button type="submit" disabled={isSubmitting} className="w-full">
						{isSubmitting ? "登録中..." : "サインアップ"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}

type RequiredAuthProps = {
	children: React.ReactNode;
};

export function RequiredAuth({ children }: RequiredAuthProps) {
	const { user, isLoading } = useCurrentUser();

	if (isLoading) {
		return null;
	}

	if (!user) {
		return <Navigate to="/login" />;
	}

	return <>{children}</>;
}
