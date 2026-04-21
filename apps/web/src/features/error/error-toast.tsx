import { Button } from "@repo/ui";
import type { AppError } from "./error";

export type ErrorToastProps = {
	error: AppError;
};

export function ErrorToast({ error }: ErrorToastProps) {
	return (
		<div className="flex flex-col space-y-2 w-full">
			<span className="font-bold">エラーが発生しました</span>
			<p>{error.displayMessage}</p>
			{error.action && (
				<div className="flex justify-end">
					<Button variant="outline" onClick={error.action.callback}>
						{error.action.label}
					</Button>
				</div>
			)}
		</div>
	);
}
