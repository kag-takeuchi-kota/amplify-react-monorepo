export const ErrorCategory = {
	Server: "Server",
	Client: "Client",
	Unknown: "Unknown",
} as const;
export type ErrorCategory = (typeof ErrorCategory)[keyof typeof ErrorCategory];

export const ErrorSeverity = {
	Low: "Low",
	Medium: "Medium",
	High: "High",
	Critical: "Critical",
} as const;
export type ErrorSeverity = (typeof ErrorSeverity)[keyof typeof ErrorSeverity];

export interface AppErrorOptions {
	displayMessage?: string;
	category?: ErrorCategory;
	severity?: ErrorSeverity;
	escalate?: boolean;
	cause?: unknown;
	metadata?: Record<string, unknown>;
	action?: {
		label: React.ReactNode;
		callback: () => void;
	};
}

export class AppError extends Error {
	displayMessage: string;
	category: ErrorCategory;
	severity: ErrorSeverity;
	escalate: boolean;
	metadata?: Record<string, unknown>;
	action?: {
		label: React.ReactNode;
		callback: () => void;
	};

	public constructor(message: string, options: AppErrorOptions = {}) {
		super(message, { cause: options.cause });
		this.name = "AppError";
		this.displayMessage = options.displayMessage ?? message;
		this.category = options.category ?? ErrorCategory.Unknown;
		this.severity = options.severity ?? ErrorSeverity.Medium;
		this.escalate = options.escalate ?? false;
		this.metadata = options.metadata;
		this.action = options.action;
	}
}

export async function handleHttpError(
	response: Response,
	options: Omit<AppErrorOptions, "category"> = {},
): Promise<Response> {
	if (response.ok) {
		return response;
	}
	const category =
		response.status >= 500 ? ErrorCategory.Server : ErrorCategory.Client;
	throw new AppError(`HTTP error ${response.status} (${category})`, {
		displayMessage:
			options.displayMessage ??
			"サーバーエラーが発生しました。しばらくしてから再度お試しください。",
		category,
		severity: options.severity ?? ErrorSeverity.Medium,
		escalate: options.escalate ?? false,
		metadata: {
			...options.metadata,
			status: response.status,
			statusText: response.statusText,
			url: response.url,
			headers: Object.fromEntries(response.headers.entries()),
			body: await response.clone().text(),
		},
		action: options.action,
	});
}

export async function tryExec<T>(
	fn: () => Promise<T>,
	options: AppErrorOptions = {},
): Promise<T> {
	try {
		return await fn();
	} catch (error) {
		if (error instanceof Error) {
			throw new AppError(error.message, {
				displayMessage:
					options.displayMessage ??
					"エラーが発生しました。しばらくしてから再度お試しください。",
				category: options.category ?? ErrorCategory.Unknown,
				severity: options.severity ?? ErrorSeverity.Medium,
				escalate: options.escalate ?? false,
				cause: error, // Store the original error as the cause
				metadata: options.metadata,
				action: options.action,
			});
		} else {
			throw new AppError("An unknown error occurred", {
				displayMessage:
					options.displayMessage ??
					"エラーが発生しました。時間を置いてから再度お試しください。",
				category: options.category ?? ErrorCategory.Unknown,
				severity: options.severity ?? ErrorSeverity.Critical, // Treat unknown errors as critical
				escalate: options.escalate ?? true,
				cause: error, // Store the original error as the cause
				metadata: options.metadata,
				action: options.action,
			});
		}
	}
}
