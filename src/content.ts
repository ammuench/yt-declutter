export const homepageSelectors: string[] = ["ytd-rich-section-renderer"];

function isHomepage(): boolean {
	const path = window.location.pathname;
	return path === "/" || path.startsWith("/feed/");
}

export const resultsPageSelectors: string[] = [
	"grid-shelf-view-model",
	"ytd-shelf-renderer",
	"ytd-horizontal-card-list-renderer",
];

function isResultsPage(): boolean {
	return window.location.pathname === "/results";
}

export function hideJunkContent(): void {
	if (isHomepage()) {
		const selectorsToHide = homepageSelectors.map(
			(selector) => `${selector}:not([data-hidden-by-extension])`,
		);

		selectorsToHide.forEach((selector) => {
			const elements = document.querySelectorAll(selector);
			elements.forEach((element) => {
				if (element instanceof HTMLElement) {
					element.style.display = "none";
					element.setAttribute("data-hidden-by-extension", "true");
				}
			});
		});
	} else if (isResultsPage()) {
		const selectorsToHide = resultsPageSelectors.map(
			(selector) => `${selector}:not([data-hidden-by-extension])`,
		);

		selectorsToHide.forEach((selector) => {
			const elements = document.querySelectorAll(selector);
			elements.forEach((element) => {
				if (element instanceof HTMLElement) {
					element.style.display = "none";
					element.setAttribute("data-hidden-by-extension", "true");
				}
			});
		});
	}
}

export function observeChanges(): void {
	if (!document.body) {
		setTimeout(observeChanges, 100);
		return;
	}

	const observer = new MutationObserver((mutations) => {
		let shouldCheck = false;

		mutations.forEach((mutation) => {
			if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
				shouldCheck = true;
			}
		});

		if (shouldCheck) {
			console.log("YT Declutter: New content added, hiding junk");
			clearTimeout(window.hideJunkTimeout);
			window.hideJunkTimeout = setTimeout(hideJunkContent, 100);
		}
	});

	observer.observe(document.body, {
		childList: true,
		subtree: true,
	});
}

function init(): void {
	console.log("YT Declutter: Extension loaded!");
	hideJunkContent();
	observeChanges();
}

// Auto-execute when loaded as content script
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", init);
} else if (
	document.readyState === "interactive" ||
	document.readyState === "complete"
) {
	init();
}
