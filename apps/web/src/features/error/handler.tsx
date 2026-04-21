import { toast } from "sonner";
import { AppError, ErrorCategory, ErrorSeverity } from "./error";
import { ErrorToast } from "./error-toast";

export function handleError(error: unknown) {
	console.error("[Error]", error);

	// Normalize the error into an AppError instance
	const apperr =
		error instanceof AppError
			? error
			: new AppError("Unknown error", {
					displayMessage:
						"エラーが発生しました。しばらくしてから再度お試しください。",
					category: ErrorCategory.Unknown,
					severity: ErrorSeverity.Critical,
					escalate: true,
					cause: error,
				});

	// Display the error message to the user
	toast.error(<ErrorToast error={apperr} />);

	// Optionally, you can also send the error to an error tracking service here
}
