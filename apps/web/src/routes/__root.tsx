import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "sonner";
import { ErrorCatcher } from "../features/error/error-catcher";

const RootLayout = () => (
	<>
		<Outlet />
		<Toaster />
		<ErrorCatcher />
		<TanStackRouterDevtools />
	</>
);

export const Route = createRootRoute({ component: RootLayout });
