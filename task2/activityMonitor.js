const { exec } = require("child_process");
const os = require("os");

function runCommand() {
    const isWindows = os.platform() === "win32";

    const command = isWindows
        ? `powershell "Get-Process | Sort-Object CPU -Descending | Select-Object -Property Name, CPU, WorkingSet -First 1 | ForEach-Object { $_.Name + ' ' + $_.CPU + ' ' + $_.WorkingSet }"`
        : `ps -A -o %cpu,%mem,comm | sort -nr | head -n 1`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing command: ${error.message}`);
            return;
        }

        if (stderr) {
            console.error(`Command stderr: ${stderr}`);
            return;
        }

        console.log(`Command output: ${stdout}`);
    });
}

runCommand();
