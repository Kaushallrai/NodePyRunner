const { spawn } = require("child_process");
const mysql = require("mysql");

const pythonScript = "python/analyze_data.py";

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "covid_data",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL server:", err);
    return;
  }
  console.log("Connected to MySQL server");
  runPythonScript();
});

function runPythonScript() {
  const pythonProcess = spawn("python", [pythonScript]);

  pythonProcess.stdout.on("data", (data) => {
    console.log(`Python script output: ${data}`);
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`Error running Python script: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    if (code === 0) {
      console.log("Python script executed successfully");
      createTables();
    } else {
      console.error(`Python script exited with code ${code}`);
    }
  });
}

function createTables() {
  const tables = [
    // Define your CREATE TABLE statements here
    `CREATE TABLE IF NOT EXISTS full_table (
                    Province_State VARCHAR(255),
                    Country_Region VARCHAR(255),
                    Lat DECIMAL(10, 8),
                    Longitude DECIMAL(11, 8),
                    Date BIGINT,
                    Confirmed INT,
                    Deaths INT,
                    Recovered INT,
                    Active INT,
                    WHO_Region VARCHAR(255)
                )`,
    `CREATE TABLE IF NOT EXISTS full_grouped (
                    Date BIGINT,
                    Country_Region VARCHAR(255),
                    Confirmed INT,
                    Deaths INT,
                    Recovered INT,
                    Active INT,
                    New_cases INT,
                    New_deaths INT,
                    New_recovered INT,
                    WHO_Region VARCHAR(255),
                    Week_Number INT,
                    Month INT
                )`,
    `CREATE TABLE IF NOT EXISTS day_wise (
                    Date BIGINT,
                    Confirmed INT,
                    Deaths INT,
                    Recovered INT,
                    Active INT,
                    New_cases INT,
                    New_deaths INT,
                    New_recovered INT,
                    Deaths_per_100_cases DECIMAL(18,2),
                    Recovered_per_100_cases DECIMAL(18,2),
                    Deaths_per_100_recovered DECIMAL(18,2),
                    No_of_countries INT
                )`,
    `CREATE TABLE IF NOT EXISTS week_wise (
                    Week_Number INT,
                    Confirmed INT,
                    Deaths INT,
                    Recovered INT,
                    Active INT,
                    New_cases INT,
                    New_deaths INT,
                    New_recovered INT
                )`,
    `CREATE TABLE IF NOT EXISTS month_wise (
                    Month INT,
                    Confirmed INT,
                    Deaths INT,
                    Recovered INT,
                    Active INT,
                    New_cases INT,
                    New_deaths INT,
                    New_recovered INT
                )`,
    `CREATE TABLE IF NOT EXISTS country_wise (
                    Country_Region VARCHAR(255),
                    Confirmed INT,
                    Deaths INT,
                    Recovered INT,
                    Active INT,
                    New_cases DECIMAL(18,1),
                    New_deaths DECIMAL(18,1),
                    New_recovered DECIMAL(18,1),
                    Deaths_per_100_cases DECIMAL(18,2),
                    Recovered_per_100_cases DECIMAL(18,2),
                    Deaths_per_100_recovered DECIMAL(18,2),
                    Confirmed_last_week INT,
                    One_week_change INT,
                    One_week_percent_increase DECIMAL(18,2),
                    WHO_Region VARCHAR(255)
                )`,
    `CREATE TABLE IF NOT EXISTS worldometer_data (
                    Country_Region VARCHAR(255),
                    Continent VARCHAR(255),
                    Population DECIMAL(18,1),
                    TotalCases INT,
                    NewCases DECIMAL(18,1),
                    TotalDeaths DECIMAL(18,1),
                    NewDeaths DECIMAL(18,1),
                    TotalRecovered DECIMAL(18,1),
                    NewRecovered DECIMAL(18,1),
                    ActiveCases DECIMAL(18,1),
                    Serious_Critical DECIMAL(18,1),
                    Tot_Cases_per_1M_pop DECIMAL(18,1),
                    Deaths_per_1M_pop DECIMAL(18,1),
                    TotalTests DECIMAL(18,1),
                    Tests_per_1M_pop DECIMAL(18,1),
                    WHO_Region VARCHAR(255)
                )`,
    `CREATE TABLE IF NOT EXISTS temp (
                    Country_Region VARCHAR(255),
                    Confirmed INT,
                    Deaths INT,
                    Recovered INT,
                    Active INT,
                    New_cases INT,
                    New_deaths INT,
                    New_recovered INT,
                    Deaths_per_100_cases FLOAT,
                    Recovered_per_100_cases FLOAT,
                    Deaths_per_100_recovered FLOAT,
                    Confirmed_last_week INT,
                    One_week_change INT,
                    One_week_percent_increase FLOAT,
                    WHO_Region VARCHAR(255)
                )`,
    `CREATE TABLE IF NOT EXISTS usa_grouped (
                    Province_State VARCHAR(255),
                    Confirmed INT,
                    Deaths INT
                )`,
    `CREATE TABLE IF NOT EXISTS who (
                    WHO_Region VARCHAR(255),
                    Confirmed INT,
                    Deaths INT,
                    Recovered INT,
                    Active INT,
                    New_cases INT,
                    Confirmed_last_week INT,
                    Fatality_Rate DECIMAL(18,2),
                    Recovery_Rate DECIMAL(18,2)
                )`,
    `CREATE TABLE IF NOT EXISTS who_g (
                    WHO_Region VARCHAR(255),
                    Date BIGINT,
                    Confirmed INT,
                    Deaths INT,
                    Recovered INT,
                    Active INT,
                    New_cases INT,
                    New_deaths INT
                )`,
  ];

  tables.forEach((tableSql) => {
    connection.query(tableSql, (err, results) => {
      if (err) {
        console.error("Error creating table:", err);
        return;
      }
      console.log("Table created:", tableSql);
    });
  });

  connection.end();
}
