const fs = require("fs");
const express = require("express");

const app = express();

app.get("/documents/resume", (req, res) => {
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

app.get("/", (req, res) => res.send("API endpoint"));

// app.get("/:path(*)", (req, res) => res.redirect("http://localhost:3002/" + req.params.path));

const port = process.env.PORT || 3001;
app.listen(port, () =>
  console.log(`Personal site backend listening on port ${port}`)
);
