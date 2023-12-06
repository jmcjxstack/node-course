import { validateInput, shortenPublicHoliday } from "./helpers";

describe("Helpers", () => {
    describe("validateInput", () => {
        it("should return true for valid input", () => {
            const result = validateInput({
                year: new Date().getFullYear(),
                country: "GB",
            });
            expect(result).toBe(true);
        });

        it("should throw an error for unsupported country", () => {
            expect(() => validateInput({ country: "US" })).toThrow(
                "Country provided is not supported"
            );
        });

        it("should throw an error for a non-current year", () => {
            expect(() => validateInput({ year: 2022 })).toThrow(
                "Year provided not the current"
            );
        });
    });

    describe("shortenPublicHoliday", () => {
        it("should shorten public holiday correctly", () => {
            const holiday = {
                date: "2023-12-25",
                localName: "Christmas Day",
                name: "Christmas Day",
                countryCode: "GB",
                fixed: true,
                global: true,
                counties: null,
                launchYear: null,
                types: ["Public"],
            };

            const result = shortenPublicHoliday(holiday);
            expect(result).toEqual({
                name: "Christmas Day",
                localName: "Christmas Day",
                date: "2023-12-25",
            });
        });
    });
});
