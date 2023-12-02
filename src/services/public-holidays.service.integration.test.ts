import {
    getListOfPublicHolidays,
    checkIfTodayIsPublicHoliday,
    getNextPublicHolidays,
} from "./public-holidays.service";

describe("Public Holidays Service Integration Tests", () => {
    it("should fetch and list public holidays for a specific year and country", async () => {
        const year = new Date().getFullYear();
        const country = "GB";

        const result = await getListOfPublicHolidays(year, country);

        expect(result).toBeDefined();
    });

    it("should check if today is a public holiday for a specific country", async () => {
        const country = "GB";
        const result = await checkIfTodayIsPublicHoliday(country);

        expect(result).toBeDefined();
    });

    it("should fetch and list the next public holidays for a specific country", async () => {
        const country = "GB";
        const result = await getNextPublicHolidays(country);

        expect(result).toBeDefined();
    });
});
