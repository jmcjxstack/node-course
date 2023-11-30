const fs = require("fs").promises;
const csvtojson = require("csvtojson");

const csvFilePath = "./task3/csvdirectory.csv";
const outputFilePath = "./task3/convertedData.txt";

async function csvToJson() {
    try {
        const jsonArray = await csvtojson({
            noheader: true,
            headers: ["book", "author", "amount", "price"],
        }).fromFile(csvFilePath);

        const jsonString = jsonArray
            .slice(1)
            .map((entry) => {
                entry.price = entry.price
                    ? parseFloat(entry.price.replace("\r", ""))
                    : null;
                return JSON.stringify(entry);
            })
            .join("\n");

        await fs.writeFile(outputFilePath, jsonString, "utf-8");
        console.log("Conversion completed!");
    } catch (error) {
        console.error("Error:", error.message);
    }
}

module.exports = csvToJson;
