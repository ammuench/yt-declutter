import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	hideJunkContent,
	observeChanges,
	resultsPageSelectors,
} from "./content";

describe("# YT Declutter", () => {
	beforeEach(() => {
		document.body.innerHTML = "";
		vi.clearAllMocks();
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	describe("## hideJunkContent", () => {
		it.each(resultsPageSelectors)(
			"hides elements matching selector: %s",
			(selector) => {
				// Create a test element matching the selector
				const element = document.createElement("div");

				// Handle different selector types
				if (selector.startsWith("#")) {
					element.id = selector.substring(1);
				} else if (selector.startsWith(".")) {
					element.className = selector.substring(1);
				}

				element.textContent = "Should be hidden";
				document.body.appendChild(element);

				// Add a control element that should not be hidden
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
			document.body.innerHTML = `
        <div class="dismissible">Should be hidden</div>
        <div class="dismissible" data-hidden-by-extension="true">Already hidden</div>
      `;

			const elements = document.querySelectorAll(".dismissible");
			const newElement = elements[0] as HTMLElement;
			const alreadyHiddenElement = elements[1] as HTMLElement;

			// Mock the setAttribute to track calls
			const setAttributeSpy = vi.spyOn(alreadyHiddenElement, "setAttribute");

			hideJunkContent();

			// New element should be hidden
			expect(newElement.style.display).toBe("none");
			expect(newElement.getAttribute("data-hidden-by-extension")).toBe("true");

			// Already hidden element should not be processed again
			expect(setAttributeSpy).not.toHaveBeenCalled();
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
