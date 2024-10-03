import formsPlugin from "@tailwindcss/forms";
import { fontFamily } from "tailwindcss/defaultTheme";

import type { Config } from "tailwindcss";

const config: Config = {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: { sans: ["Titillium Web", ...fontFamily.sans] },
			colors: {
				secondary: "#FFFFFF",
				primary: "#171717",
			},
		},
	},
	plugins: [formsPlugin],
};

export default config;
