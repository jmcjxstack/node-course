const { exec } = require("child_process");
const fs = require("fs");

function runCommand(command) {
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing command: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Command execution resulted in an error: ${stderr}`);
            return;
        }

        const currentTime = new Date().getTime();
        const logEntry = `${currentTime} : ${stdout.trim()}\n`;

        process.stdout.write(`\r${stdout.trim()}`);

        fs.appendFile("activityMonitor.log", logEntry, (err) => {
            if (err) {
                console.error(
                    `Error appending to the log file: ${err.message}`
                );
            }
        });
    });
}

function main() {
    function runSystemCommand() {
        const os = process.platform;
        let command = "";

        if (os === "win32") {
            command =
                "powershell \"Get-Process | Sort-Object CPU -Descending | Select-Object -Property Name, CPU, WorkingSet -First 1 | ForEach-Object { $_.Name + '  ' + $_.CPU + '  '  + $_.WorkingSet }\"";
        } else {
            command = "ps -A -o %cpu,%mem,comm | sort -nr | head -n 1";
        }

        runCommand(command);
    }

    setInterval(runSystemCommand, 1000);

    setInterval(() => {
        const currentTime = new Date().getTime();
        const logEntry = `${currentTime} : Log entry from interval\n`;

        fs.appendFile("activityMonitor.log", logEntry, (err) => {
            if (err) {
                console.error(
                    `Error appending to the log file: ${err.message}`
                );
            }
        });
    }, 60000);
}

main();
