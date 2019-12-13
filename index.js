const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const crypto = require("crypto");
const safeCompare = require("safe-compare");
const concat = require("concat-stream");
const MongoClient = require("mongodb").MongoClient;

const app = express();

app.use(function(req, res, next) {
  req.pipe(
    concat(function(data) {
      req.body = data;
      next();
    })
  );
});

app.get("/documents/resume", (req, res) => {
  res.redirect(`${process.env.API_URL}/documents/Resume%20-%20Simon%20Liu`);
});

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

app.post("/webhooks/:repo", (req, res) => {
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
  console.log(`Pulling ${req.params.repo}...`);
  exec(`git -C ~/${req.params.repo} pull`, (err, stdout, stderr) => {
    if (err) {
      res.status(500).send(stderr);
    } else {
      res.status(200).send(stdout);
    }
    console.log(`Building ${req.params.repo}...`);
    exec(`yarn --cwd ../${req.params.repo} build`, (err, stdout, stderr) => {
      if (err) {
        console.log(stderr);
      } else {
        console.log(stdout);
      }
    });
  });
});

/* Overall resume endpoint */
app.get("/resume", (req, res) => {
  MongoClient.connect(
    "mongodb://localhost:27017/",
    { useUnifiedTopology: true },
    (err, client) => {
      // catch error if it exists
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }

      // find all collections
      client
        .db("resume")
        .collections()
        .then(result => {
          // iterate over all collections
          let cargo = {};
          Promise.all(
            result.map(collection => {
              return collection
                .find({})
                .toArray()
                .then(arr => {
                  cargo[collection.collectionName] = arr;
                });
            })
          ).then(() => {
            res.header("Content-Type", "application/json");
            res.status(200).send(JSON.stringify(cargo, null, 4));
            client.close();
          });
        });
    }
  );
});

/* Resume category endpoints */
app.get("/resume/:category", (req, res) => {
  MongoClient.connect(
    "mongodb://localhost:27017/",
    { useUnifiedTopology: true },
    (err, client) => {
      // catch error if it exists
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }

      // find collection
      var collection = client.db("resume").collection(req.params.category);

      collection.find({}).sort({"startDate": -1, "year": -1}).toArray((err, result) => {
        if (err) throw err;
        res.header("Content-Type", "application/json");
        res.status(200).send(JSON.stringify(result, null, 4));
        client.close();
      });
    }
  );
});

app.get("/", (req, res) => res.send("API endpoint"));

// app.get("/:path(*)", (req, res) => res.redirect("http://localhost:3002/" + req.params.path));

const port = process.env.PORT || 3001;
app.listen(port, () =>
  console.log(`Personal site backend listening on port ${port}`)
);
