import axios from "axios";

describe("Public Holidays E2E Tests", () => {
    const API_URL = "https://date.nager.at/api/v3";

    it("should fetch and list public holidays for a specific year and country", async () => {
        const year = 2023;
        const country = "GB";

        const response = await axios.get(
            `${API_URL}/PublicHolidays/${year}/${country}`
        );

        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
    });

    it("should fetch and list the next public holidays for a specific country", async () => {
        const country = "GB";

        const response = await axios.get(
            `${API_URL}/NextPublicHolidays/${country}`
        );

        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
    });
});
