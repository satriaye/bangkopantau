const express = require("express");
const path = require("path");
const { google } = require("googleapis");

const app = express();
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));
app.use("/aset", express.static(path.join(__dirname, "aset")));
app.use("/css", express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const getGCPCredentials = () => {

  return process.env.GCP_PRIVATE_KEY
    ? {
        client_email: process.env.GCP_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GCP_PRIVATE_KEY.replace(/\\n/g, "\n"), 
      }
    :
      {};
};

app.post("/search", async (req, res) => {
  try {
    const { searchTerm } = req.body; 

  
    const auth = new google.auth.GoogleAuth({
      credentials: getGCPCredentials(),
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    const client = await auth.getClient();

    
    const googleSheets = google.sheets({
      version: "v4",
      auth: client
    });

    const spreadsheetId = "";

   
    const searchRows = await googleSheets.spreadsheets.values.get({
      spreadsheetId,
      range: ``,
    });

    const foundValues = searchRows.data.values
      .filter((row) => row.includes(searchTerm))
      .map((row) => row.join(","));

    if (foundValues.length > 0) {
      res.send(foundValues.join("<br>"));
    } else {
      res.send("No matching values found.");
    }
  } catch (error) {
    console.error("Error handling POST request:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = app; 
