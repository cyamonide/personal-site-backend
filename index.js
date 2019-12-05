const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const { exec } = require("child_process");

const app = express();

app.use(bodyParser.json());

app.get("/documents/resume", (req, res) => {
  res.redirect(`${process.env.API_URL}/documents/Resume%20-%20Simon%20Liu`);
});

app.get("/documents/Resume%20-%20Simon%20Liu", (req, res) => {
    const path = __dirname + "/public/documents/resume.pdf";
    fs.readFile(path, (err, data) => {
      if (err) {
        res.send(err.message);
      }
      else {
        res.contentType("application/pdf");
        res.send(data);
      }
    });
  });

app.post("/webhooks/:repo", (req, res) => {
  console.log(`Pulling ${req.params.repo}...`);
  exec(`git -C ~/${req.params.repo} pull`, (err, stdout, stderr) => {
    if (err) {
      res.status(500).send(stderr);
    } else {
      res.status(200).send(stdout);
    }
  });
});

app.get("/", (req, res) => res.send("API endpoint"));

// app.get("/:path(*)", (req, res) => res.redirect("http://localhost:3002/" + req.params.path));

const port = process.env.PORT || 3001;
app.listen(port, () =>
  console.log(`Personal site backend listening on port ${port}`)
);
