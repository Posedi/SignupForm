const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// fetch signup page
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});
// fetch what user types into the form.
app.post("/", function(req, res) {
  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;

  // mailchimp needs this object to work
  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };
  // json to js and back
  var jsonData = JSON.stringify(data);
  // authorization of the post
  var options = {
    url: "https://us4.api.mailchimp.com/3.0/lists/8c68dc39e8",
    method: "POST",
    headers: {
      Authorization: "inglorious1 a503b8d6513bc0acccbd9c97ba89da9f-us4"
    },
    body: jsonData
  };
  // check for error and serve up success and error page
  request(options, function(error, response, body) {
    if (error) {
      res.sendFile(__dirname + "/failure.html");
    } else {
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    }
  });
});
// if error theres a button to go back and try again
app.post("/failure.html", function(req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is alive at 3000");
});
