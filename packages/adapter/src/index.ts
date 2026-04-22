import outputs from "@repo/infra/amplify_outputs.json";
import { Amplify } from "aws-amplify";

export function initialize() {
	Amplify.configure(outputs);
}

export * from "./types";
export * from "./auth";
