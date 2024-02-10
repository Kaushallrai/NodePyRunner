// analyze_data.js
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

// Define file paths
const pythonScript = path.join(__dirname, "python/analyze_data.py");
const outputFilePath = path.join(__dirname, "statistics.txt");

const pythonProcess = spawn("python", [pythonScript]);

let output = "";

pythonProcess.stdout.on("data", (data) => {
  output += data.toString();
});

pythonProcess.stderr.on("data", (data) => {
  console.error(`Error: ${data}`);
});

pythonProcess.on("close", (code) => {
  if (code === 0) {
    fs.writeFileSync(outputFilePath, output);
    console.log("Statistics exported to statistics.txt");
  } else {
    console.error(`Python script exited with code ${code}`);
  }
});
