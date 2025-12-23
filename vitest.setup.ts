import { vi } from "vitest";

// Suppress console logs during all tests (including module imports)
vi.spyOn(console, "log").mockImplementation(() => {});
