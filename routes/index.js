var express = require("express");
var router = express.Router();
const { google } = require("googleapis");

// this file just contains the secret keys
const CONSTS = require("../utils/keys.js"); 

const oauthClient = new google.auth.OAuth2(
  CONSTS.CLIENT_ID,
  CONSTS.CLIENT_SECRET,
  "http://localhost:3000/oauthredirect"
);

const scopes = "profile email";

/* GET home page. */
router.get("/", function (req, res, next) {
  const url = oauthClient.generateAuthUrl({
    scope: scopes,
  });
  console.log(url);
  res.render("index", { oauthUrl: url });
});

/* OAuth callback */
router.get("/oauthredirect", function (req, res, next) {
  var code = req.query.code;
  var oauth2 = google.oauth2({ auth: oauthClient, version: "v2" });

  oauthClient.getToken(code, function (err, tokens) {
    if (!err) {
      oauthClient.setCredentials(tokens);

      oauth2.userinfo.get(function (err, profileRes) {
        if (err) {
          res.render("error", {
            message: err,
            error: { status: "Error.", stack: "" },
          });
        } else {
          res.render("loginredirect", {
            profile: {
              name: profileRes.data.name,
              email: profileRes.data.email,
            },
          });
        }
      });
    }
  });
});

module.exports = router;
