const { spawn } = require("child_process");

// Define the path to your Python script
const pythonScript = "python/analyze_data.py";

// Spawn a new process to run the Python script
const pythonProcess = spawn("python", [pythonScript]);

// Listen for stdout data from the Python script
pythonProcess.stdout.on("data", (data) => {
  console.log(`Python script output: ${data}`);
});

// Listen for stderr data from the Python script
pythonProcess.stderr.on("data", (data) => {
  console.error(`Error running Python script: ${data}`);
});

// Listen for the Python script to close
pythonProcess.on("close", (code) => {
  if (code === 0) {
    console.log("Python script executed successfully");
  } else {
    console.error(`Python script exited with code ${code}`);
  }
});
