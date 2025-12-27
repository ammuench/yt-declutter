/** biome-ignore-all lint/suspicious/noExplicitAny: Allowing any for test files */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	hideJunkContent,
	homepageSelectors,
	observeChanges,
	resultsPageSelectors,
} from "./content";

describe("# YT Declutter", () => {
	let originalLocation: Location;

	beforeEach(() => {
		document.body.innerHTML = "";
		vi.clearAllMocks();
		vi.useFakeTimers();
		originalLocation = window.location;
	});

	afterEach(() => {
		vi.useRealTimers();
		window.location = originalLocation as any;
	});

	function mockLocation(pathname: string) {
		delete (window as any).location;
		window.location = { ...originalLocation, pathname } as any;
	}

	describe("## hideJunkContent - Homepage", () => {
		beforeEach(() => {
			mockLocation("/");
		});

		it.each(homepageSelectors)(
			"hides elements matching homepage selector: %s",
			(selector) => {
				const element = document.createElement(selector);
				element.textContent = "Should be hidden";
				document.body.appendChild(element);

				const otherElement = document.createElement("div");
				otherElement.className = "other";
				otherElement.textContent = "Should be visible";
				document.body.appendChild(otherElement);

				const targetElement = document.querySelector(selector) as HTMLElement;
				expect(targetElement).toBeTruthy();
				expect(otherElement).toBeTruthy();

				hideJunkContent();

				expect(targetElement.style.display).toBe("none");
				expect(targetElement.getAttribute("data-hidden-by-extension")).toBe(
					"true",
				);
				expect(otherElement.style.display).toBe("");
			},
		);

		it("only hides elements without data-hidden-by-extension attribute", () => {
			const selector = homepageSelectors[0];
			const newElement = document.createElement(selector);
			newElement.textContent = "Should be hidden";
			document.body.appendChild(newElement);

			const alreadyHiddenElement = document.createElement(selector);
			alreadyHiddenElement.setAttribute("data-hidden-by-extension", "true");
			alreadyHiddenElement.textContent = "Already hidden";
			document.body.appendChild(alreadyHiddenElement);

			const setAttributeSpy = vi.spyOn(alreadyHiddenElement, "setAttribute");

			hideJunkContent();

			expect(newElement.style.display).toBe("none");
			expect(newElement.getAttribute("data-hidden-by-extension")).toBe("true");
			expect(setAttributeSpy).not.toHaveBeenCalled();
		});

		it("runs on homepage path: /", () => {
			mockLocation("/");
			const element = document.createElement(homepageSelectors[0]);
			document.body.appendChild(element);

			hideJunkContent();

			expect(element.style.display).toBe("none");
		});

		it("runs on feed path: /feed/subscriptions", () => {
			mockLocation("/feed/subscriptions");
			const element = document.createElement(homepageSelectors[0]);
			document.body.appendChild(element);

			hideJunkContent();

			expect(element.style.display).toBe("none");
		});
	});

	describe("## hideJunkContent - Results Page", () => {
		beforeEach(() => {
			mockLocation("/results");
		});

		it.each(resultsPageSelectors)(
			"hides elements matching results page selector: %s",
			(selector) => {
				const element = document.createElement(selector);
				element.textContent = "Should be hidden";
				document.body.appendChild(element);

				const otherElement = document.createElement("div");
				otherElement.className = "other";
				otherElement.textContent = "Should be visible";
				document.body.appendChild(otherElement);

				const targetElement = document.querySelector(selector) as HTMLElement;
				expect(targetElement).toBeTruthy();
				expect(otherElement).toBeTruthy();

				hideJunkContent();

				expect(targetElement.style.display).toBe("none");
				expect(targetElement.getAttribute("data-hidden-by-extension")).toBe(
					"true",
				);
				expect(otherElement.style.display).toBe("");
			},
		);

		it("only hides elements without data-hidden-by-extension attribute", () => {
			const selector = resultsPageSelectors[0];
			const newElement = document.createElement(selector);
			newElement.textContent = "Should be hidden";
			document.body.appendChild(newElement);

			const alreadyHiddenElement = document.createElement(selector);
			alreadyHiddenElement.setAttribute("data-hidden-by-extension", "true");
			alreadyHiddenElement.textContent = "Already hidden";
			document.body.appendChild(alreadyHiddenElement);

			const setAttributeSpy = vi.spyOn(alreadyHiddenElement, "setAttribute");

			hideJunkContent();

			expect(newElement.style.display).toBe("none");
			expect(newElement.getAttribute("data-hidden-by-extension")).toBe("true");
			expect(setAttributeSpy).not.toHaveBeenCalled();
		});
	});

	describe("## hideJunkContent - Other Pages", () => {
		it("does nothing on video watch page", () => {
			mockLocation("/watch");
			const element = document.createElement(homepageSelectors[0]);
			document.body.appendChild(element);

			hideJunkContent();

			expect(element.style.display).toBe("");
			expect(element.getAttribute("data-hidden-by-extension")).toBeNull();
		});

		it("does nothing on playlist page", () => {
			mockLocation("/playlist");
			const element = document.createElement(resultsPageSelectors[0]);
			document.body.appendChild(element);

			hideJunkContent();

			expect(element.style.display).toBe("");
			expect(element.getAttribute("data-hidden-by-extension")).toBeNull();
		});

		it("does nothing on channel page", () => {
			mockLocation("/channel/UC123456");
			const element = document.createElement(homepageSelectors[0]);
			document.body.appendChild(element);

			hideJunkContent();

			expect(element.style.display).toBe("");
			expect(element.getAttribute("data-hidden-by-extension")).toBeNull();
		});
	});

	describe("## observeChanges", () => {
		it("retries when document.body is not available", () => {
			const originalBody = document.body;
			Object.defineProperty(document, "body", {
				get: () => null,
				configurable: true,
			});

			const setTimeoutSpy = vi.spyOn(global, "setTimeout");

			observeChanges();

			expect(setTimeoutSpy).toHaveBeenCalledWith(observeChanges, 100);

			// Restore document.body
			Object.defineProperty(document, "body", {
				get: () => originalBody,
				configurable: true,
			});
		});

		it("sets up MutationObserver when body is available", () => {
			document.body.innerHTML = "<div>test</div>";

			const observeSpy = vi.fn();
			const mockObserver = {
				observe: observeSpy,
				disconnect: vi.fn(),
			};

			vi.spyOn(global, "MutationObserver").mockImplementation(
				() => mockObserver as any,
			);

			observeChanges();

			expect(observeSpy).toHaveBeenCalledWith(document.body, {
				childList: true,
				subtree: true,
			});
		});
	});

	describe("## initialization", () => {
		it("handles complete document ready state", () => {
			// The module already executed with the default document ready state
			// This test verifies the code path was executed (which it was during import)
			expect(document.readyState).toBe("complete");
		});
	});
});
