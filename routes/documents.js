var express = require("express");
var fs = require("fs");
var router = express.Router();

/* GET users listing. */
router.get("/resume", function(req, res, next) {
  const path = __dirname + "/../public/documents/resume.pdf";
  fs.readFile(path, function(err, data) {
    if (err) {
      res.send(err.message)
    }
    else {
      res.contentType("application/pdf");
      res.send(data);
    }
  });
});

module.exports = router;
