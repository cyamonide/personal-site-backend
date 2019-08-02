const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

app.get("/documents/resume", (req, res) => {
    const path = __dirname + "/public/documents/Resume - Simon Liu (Last updated August 1, 2019).pdf";
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
  console.log(req.body);
  console.log(req.params.repo);
  res.sendStatus(200);
});

app.get("/", (req, res) => res.send("API endpoint"));

// app.get("/:path(*)", (req, res) => res.redirect("http://localhost:3002/" + req.params.path));

const port = process.env.PORT || 3001;
app.listen(port, () =>
  console.log(`Personal site backend listening on port ${port}`)
);
