const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
require("dotenv").config();

const app = express();



// refering to our static files for display on server
app.use(express.static("public"));

// Using body parser to parse through my inputs
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members:[
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

  const jsonData = JSON.stringify(data);
  const url = "https://us2.api.mailchimp.com/3.0/lists/548ac44b6d" ;
  const options = {
    method: "POST",
    auth: process.env.API_KEY
  }

  const Request = https.request(url, options, function(response){

    // If request is successful the this happens

    if (response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));

    });

  });

  // comment out request.write if you want to check out the failure page.
  Request.write(jsonData);
  Request.end();

});

// for working on Heroku and locally
app.listen(process.env.PORT  || 3000, function(){
  console.log("Server up and running on port 3000");
});
