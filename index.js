const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const crypto = require("crypto");
const safeCompare = require("safe-compare");
const concat = require("concat-stream");

const app = express();

app.use(function(req, res, next) {
  req.pipe(
    concat(function(data) {
      req.body = data;
      next();
    })
  );
});

/* PDF resume redirect */
app.get("/documents/resume", (req, res) => {
  res.redirect(`${process.env.API_URL}/documents/Resume%20-%20Simon%20Liu`);
});

/* PDF resume endpoint */
app.get("/documents/Resume%20-%20Simon%20Liu", (req, res) => {
  const path = __dirname + "/public/documents/resume.pdf";
  fs.readFile(path, (err, data) => {
    if (err) {
      res.send(err.message);
    } else {
      res.contentType("application/pdf");
      res.send(data);
    }
  });
});

/* Webhooks endpoint */
app.post("/webhooks/:repo", (req, res) => {
  // Verify secret
  const computed =
    "sha1=" +
    crypto
      .createHmac("sha1", process.env.GIT_WEBHOOKS_SECRET)
      .update(req.body)
      .digest("hex");
  const received = req.get("X-Hub-Signature");
  if (!safeCompare(computed, received)) {
    res.status(401).send("Incorrect secret.");
    return;
  }

  const {repo} = req.params;

  // Update repository
  console.log(`Pulling ${repo}...`);
  exec(`git -C ~/${repo} pull`, (err, stdout, stderr) => {
    if (err) {
      res.status(500).send(stderr);
    } else {
      res.status(200).send(stdout);
    }
    // Handle different repositories
    if (["personal-site-backend", "course-notes"].indexOf(repo) > -1) {
      // Restart pm2 server
      console.log("Restarting pm2 server...");
      exec(`pm2 restart ${repo}`, (err, stdout, stderr) => {
        console.log(err ? stderr : stdout);
      });
    } else if (["personal-site-frontend", "resume"].indexOf(repo) > -1) {
      // Build project
      console.log(`Building ${repo}...`);
      exec(`yarn --cwd ../${repo} build`, (err, stdout, stderr) => {
        console.log(err ? stderr : stdout);
      });
    }
  });
});

app.get("/", (req, res) => res.send("API endpoint"));

// app.get("/:path(*)", (req, res) => res.redirect("http://localhost:3002/" + req.params.path));

const port = process.env.PORT || 3001;
app.listen(port, () =>
  console.log(`Personal site backend listening on port ${port}`)
);
