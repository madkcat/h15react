//dependencies
const express = require('express');
var bodyParser = require("body-parser");
const path = require('path');
const app = express();
const routes = require("../routes");
var db = require("../models");

//connections
const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose");
mongoose.Promise = Promise;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/nyt";
mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../react-ui/build')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(routes);

// Answer API requests.
app.get('/api', function (req, res) {
  res.set('Content-Type', 'application/json');
  res.send('{"message":"Hello from the custom server!"}');
});

const googleInfoArr = []

// app.get("/restaurant", function(req, res) {
//   // Grab every document in the Articles collection
//   db.Restaurants
//     .find({})
//     .then(function(dbRestaurant) {
//       // If we were able to successfully find Articles, send them back to the client
//       res.json(dbRestaurant);
//     })
//     .catch(function(err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
// });

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});


APIlookup = (url, params, header) => {
    return axios.get(url, {
        params: params
      }
    )
  };
  getAPIData = (callback) => {
    const url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";

    const params = {
      // input api key here and edit/add params
      "key": "AIzaSyAI3ZBCPyqDGRp9S20p7xisIcIfJrHhSGI",
      "type":'restaurant',
      "location": "37.8044,-122.2711",
      "radius": "10000.4",
      // "pagetoken": "CqQCGwEAAB4hrH2UlcrwY7fmKyTZ9oZ-dbrDb5scyAPiNSNq6Oidl7t-lpfisnMpp5Y6qgQmRn2KEJ8DPSxzqmx9bTUXhAe8zh7JyEJ7dk1yFOs_F4RtgzsGHQC5_XLP0Ss1Vy3rTjVzS7YPfa_civ4qSa_OIY3sgH62tuSc6WuO0GIxUbPcAd1cr7qmwAvrGz-ncLVvLd2PZ59RtI1-slZhvITehH5jKUpaUXKqA7q2HAJK0f8Hw4Mcu-oWKYVVNI7lmgQcRsjP1pJwspsAqjKjm5BqIPD2gnLaN2h0WPuHySSB3gTD9VUAavvqB8Nj0x5tJ3TYPoS3jKoVZv6vAXKT_4AlvCUZMcwPMVVQ4Dc9CG31PyUm0Lt5Xm2JKUMWnUi6gmfS5xIQyjRwFS5xpjZEK7xFhzdQRBoUEb9vx9xea2Zqhu5Co33Bdg7Etew"
    };
    


    APIlookup(url, params)
      .then((res) => {
        const data = res.data.results;

        data.map(item => {
          // google information
          let goLocation = item.geometry.location.lat + "," + item.geometry.location.lng;
          let goName = item.name;
          let goPlaceId = item.place_id;
          googleInfoArr.push({
            goName: goName,
            goLocation: goLocation,
            goPlaceId: goPlaceId
          });
        });
        console.log(googleInfoArr);

        let pagetoken = res.data.next_page_token;
        let params = {
          "key": res.config.params.key,
          "pagetoken": pagetoken
        };

        setTimeout(() => {
          APIlookup(url, params)
            .then(res => {
              res.data.results.map(item => {
                googleInfoArr.push({
                  goName: item.name,
                  goLocation: item.geometry.location,
                  goPlaceId: item.place_id
                })
              })
              console.log(googleInfoArr);


              let pagetoken = res.data.next_page_token;
              let params = {
                "key": res.config.params.key,
                "pagetoken": pagetoken
              };
              
              setTimeout(() => {
                APIlookup(url, params)
                  .then(res => {
                    console.log(res.data.results);
                    res.data.results.map(item => {
                      googleInfoArr.push({
                        goName: item.name,
                        goLocation: item.geometry.location,
                        goPlaceId: item.place_id
                      })
                    })
                    runGoogleAPI();
                  })
                }, 3000)
            })
          }, 3000)
      })
      .catch(err => console.log(err))

  };

runGoogleAPI = () => {
    // add URL here
    const url = "https://maps.googleapis.com/maps/api/place/details/json";
    const goPlacesDetArr = [];
      googleInfoArr.map(item => {
        let params = {
          // input api key here and edit/add params
          "key": "AIzaSyAI3ZBCPyqDGRp9S20p7xisIcIfJrHhSGI",
          "placeid": item.goPlaceId
        };
        APIlookup(url, params)
        .then(res => {
          console.log(res);
          let result = {};
          
          result.name = res.data.result.name;
  		    result.id = res.data.result.place_id;
          result.location = res.data.result.vicinity;
          MongoClient.connect(local, function(err, db) {
            db.db('trendingreviewapp').collection('restaurants').insert(result);

            console.log('submitted')
            db.close();
          });
          // db.Restaurants
          // .insertMany(res)
          // .then(function(dbRestaurant) {
          //   // If we were able to successfully scrape and save an Article, send a message to the client
          //   console.log("Google places object created" + dbRestaurant);
          // })
          // .catch(function(err) {
          //   // If an error occurred, send it to the client
          //   // res.json(err);
          //   console.log("error" + err)
          // });
        })
        .catch(err => console.log(err))
      });
};

app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});
