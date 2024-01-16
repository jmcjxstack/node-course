import axios, { AxiosResponse } from "axios";
import {
    getListOfPublicHolidays,
    checkIfTodayIsPublicHoliday,
    getNextPublicHolidays,
} from "./public-holidays.service";
import { PUBLIC_HOLIDAYS_API_URL } from "../config";
import { validateInput, shortenPublicHoliday } from "../helpers";
import { PublicHoliday } from "../types";

jest.mock("../helpers", () => ({
    ...jest.requireActual("../helpers"),
    validateInput: jest.fn(),
}));

jest.mock("axios");

describe("Public Holidays Service", () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    describe("getListOfPublicHolidays", () => {
        it("should fetch and shorten public holidays", async () => {
            const mockData: PublicHoliday[] = [
                {
                    date: "2023-01-01",
                    localName: "New Year's Day",
                    name: "New Year's Day",
                    countryCode: "GB",
                    fixed: false,
                    global: false,
                    counties: ["GB-NIR"],
                    launchYear: null,
                    types: ["Public"],
                },
                {
                    date: "2023-01-02",
                    localName: "New Year's Day",
                    name: "New Year's Day",
                    countryCode: "GB",
                    fixed: false,
                    global: false,
                    counties: ["GB-ENG", "GB-WLS"],
                    launchYear: null,
                    types: ["Public"],
                },
            ];

            (
                axios.get as jest.MockedFunction<typeof axios.get>
            ).mockResolvedValue({ data: mockData } as AxiosResponse);

            const result = await getListOfPublicHolidays(2023, "GB");

            expect(axios.get).toHaveBeenCalledWith(
                `${PUBLIC_HOLIDAYS_API_URL}/PublicHolidays/2023/GB`
            );
            expect(validateInput).toHaveBeenCalledWith({
                year: 2023,
                country: "GB",
            });

            const expectedShortenedData = mockData.map(shortenPublicHoliday);
            expect(result).toEqual(expectedShortenedData);
        });

        it("should handle API error and return an empty array", async () => {
            (
                axios.get as jest.MockedFunction<typeof axios.get>
            ).mockRejectedValue(new Error("API error"));

            const result = await getListOfPublicHolidays(2023, "GB");

            expect(result).toEqual([]);
        });
    });

    describe("checkIfTodayIsPublicHoliday", () => {
        it("should check if today is a public holiday", async () => {
            (
                axios.get as jest.MockedFunction<typeof axios.get>
            ).mockResolvedValue({ status: 200 } as AxiosResponse);

            const result = await checkIfTodayIsPublicHoliday("GB");

            expect(axios.get).toHaveBeenCalledWith(
                `${PUBLIC_HOLIDAYS_API_URL}/IsTodayPublicHoliday/GB`
            );
            expect(validateInput).toHaveBeenCalledWith({ country: "GB" });
            expect(result).toBe(true);
        });

        it("should handle API error and return false", async () => {
            (
                axios.get as jest.MockedFunction<typeof axios.get>
            ).mockRejectedValue(new Error("API error"));

            const result = await checkIfTodayIsPublicHoliday("GB");

            expect(result).toBe(false);
        });
    });

    describe("getNextPublicHolidays", () => {
        it("should fetch and shorten next public holidays", async () => {
            const mockData: PublicHoliday[] = [
                {
                    date: "2023-12-25",
                    localName: "Christmas Day",
                    name: "Christmas Day",
                    countryCode: "GB",
                    fixed: false,
                    global: true,
                    counties: null,
                    launchYear: null,
                    types: ["Public"],
                },
                {
                    date: "2023-12-26",
                    localName: "Boxing Day",
                    name: "St. Stephen's Day",
                    countryCode: "GB",
                    fixed: false,
                    global: true,
                    counties: null,
                    launchYear: null,
                    types: ["Public"],
                },
            ];

            (
                axios.get as jest.MockedFunction<typeof axios.get>
            ).mockResolvedValue({ data: mockData } as AxiosResponse);

            const result = await getNextPublicHolidays("GB");

            expect(axios.get).toHaveBeenCalledWith(
                `${PUBLIC_HOLIDAYS_API_URL}/NextPublicHolidays/GB`
            );
            expect(validateInput).toHaveBeenCalledWith({ country: "GB" });

            const expectedShortenedData = mockData.map(shortenPublicHoliday);
            expect(result).toEqual(expectedShortenedData);
        });

        it("should handle API error and return an empty array", async () => {
            (
                axios.get as jest.MockedFunction<typeof axios.get>
            ).mockRejectedValue(new Error("API error"));

            const result = await getNextPublicHolidays("GB");

            expect(result).toEqual([]);
        });
    });
});
