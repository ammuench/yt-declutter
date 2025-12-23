declare global {
	interface Window {
		hideJunkTimeout?: number | NodeJS.Timeout;
	}
}

export {};
