import React from "react";
import { handleError } from "./handler";

export function ErrorCatcher() {
	React.useEffect(() => {
		const handleErrorEvent = (event: ErrorEvent) => {
			handleError(event.error);
		};
		const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
			handleError(event.reason);
		};

		window.addEventListener("error", handleErrorEvent);
		window.addEventListener("unhandledrejection", handleUnhandledRejection);

		return () => {
			window.removeEventListener("error", handleErrorEvent);
			window.removeEventListener(
				"unhandledrejection",
				handleUnhandledRejection,
			);
		};
	}, []);

	return null; // This component doesn't render anything
}
