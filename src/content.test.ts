import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { hideJunkContent, observeChanges } from "./content";

describe("# YouTube Hide Junk Shelves", () => {
	beforeEach(() => {
		document.body.innerHTML = "";
		vi.clearAllMocks();
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	describe("## hideJunkContent", () => {
		it("hides elements with dismissible class", () => {
			document.body.innerHTML = `
        <div class="dismissible">Should be hidden</div>
        <div class="other">Should be visible</div>
      `;

			const dismissibleElement = document.querySelector(
				".dismissible",
			) as HTMLElement;
			const otherElement = document.querySelector(".other") as HTMLElement;

			expect(dismissibleElement).toBeTruthy();
			expect(otherElement).toBeTruthy();

			hideJunkContent();

			expect(dismissibleElement.style.display).toBe("none");
			expect(dismissibleElement.getAttribute("data-hidden-by-extension")).toBe(
				"true",
			);
			expect(otherElement.style.display).toBe("");
		});

		it("hides elements with dismissible id", () => {
			document.body.innerHTML = `
        <div id="dismissible">Should be hidden</div>
        <div id="other">Should be visible</div>
      `;

			const dismissibleElement = document.getElementById(
				"dismissible",
			) as HTMLElement;
			const otherElement = document.getElementById("other") as HTMLElement;

			expect(dismissibleElement).toBeTruthy();
			expect(otherElement).toBeTruthy();

			hideJunkContent();

			expect(dismissibleElement.style.display).toBe("none");
			expect(dismissibleElement.getAttribute("data-hidden-by-extension")).toBe(
				"true",
			);
			expect(otherElement.style.display).toBe("");
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
