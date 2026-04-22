import React from "react";
import { createRoot } from "react-dom/client";
import { initialize as initializeAdapter } from "@repo/adapter";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import "./style.css";
import { routeTree } from "./routeTree.gen";

initializeAdapter();

const element = document.getElementById("app");
if (!element) {
	throw new Error("Failed to find the root element");
}

const router = createRouter({
	routeTree,
});

const root = createRoot(element);

root.render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
);
