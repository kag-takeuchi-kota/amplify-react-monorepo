import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./style.css";

const element = document.getElementById("app");
if (!element) {
	throw new Error("Failed to find the root element");
}

const root = createRoot(element);

root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
