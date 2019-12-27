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
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  // mailchimp needs this object to work
  const data = {
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
  const jsonData = JSON.stringify(data);
  // authorization of the post
  const options = {
    url: "https://us4.api.mailchimp.com/3.0/lists/8c68dc39e8",
    method: "POST",
    headers: {
      Authorization: "here comes your authorization key"
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
