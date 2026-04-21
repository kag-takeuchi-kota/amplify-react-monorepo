import { Button, Toaster } from "@repo/ui";
import React from "react";
import { tryExec } from "./features/error/error";
import { ErrorCatcher } from "./features/error/error-catcher";

export function App() {
	const [count, setCount] = React.useState(0);

	return (
		<div>
			<h1>Hello, World!</h1>
			<p>Count: {count}</p>
			<Button variant="outline" onClick={() => setCount((c) => c + 1)}>
				Increment
			</Button>
			<Button
				variant="destructive"
				onClick={() => {
					void tryExec(
						() => {
							throw new Error("Something went wrong!");
						},
						{ displayMessage: "エラー発生！" },
					);
				}}
			>
				エラー発生ボタン
			</Button>
			<ErrorCatcher />
			<Toaster />
		</div>
	);
}
