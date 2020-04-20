var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Vehicle = require('./app/models/vehicles');

//Configure app for bodyParser()
// body parser is used to get body of request
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// set up port for server to listen on
var port = process.env.PORT || 3000;

//Connect to database
mongoose.connect('mongodb://localhost:27017/codealong')

//API Routes
var router = express.Router();

// Routes will all be prefixed with /API
app.use('/api', router);

//Middleware -
//Middleware can be very useful for doing validations. We can log things from
// here or stop the request from continuing in the event that the request is
//not safe.
//middleware to use for all requests
router.use(function(req,res,next){
  console.log('FYI... There is some processing currently going down...');
  next()
});

//Test Route
router.get('/', function(req, res){
res.json({message: 'Welcome to our API!'});
});

//vehicles route
router.route('/vehicles')
  .post(function(req,res){
    var vehicle = new Vehicle(); // new instance of a vehicle
    vehicle.make = req.body.make;
    vehicle.model = req.body.model;
    vehicle.color = req.body.color;
    vehicle.save(function(err){
      if (err){
        res.send(err);
      }
      res.json({message: 'Vehicle was successfully manufactured'});
    });
  })

  .get(function(req,res){
    Vehicle.find(function(err, vehicles){
      if (err){
        res.send(err);
      }
      res.json(vehicles);
    });
  });

router.route('/vehicle/:vehicle_id')
  .get(function(req,res){
    Vehicle.findById(req.params.vehicle_id, function(err, vehicle){
      if(err){
        res.send(err);
      }
      res.json(vehicle);
    });
  });

router.route('/vehicle/make/:make')
  .get(function(req,res){
    Vehicle.find({make:req.params.make}, function(err, vehicle){
      if(err){
        res.send(err);
      }
      res.json(vehicle);
    });
  });

router.route('/vehicle/color/:color')
  .get(function(req,res){
    Vehicle.find({color:req.params.color}, function(err, vehicle){
      if(err){
        res.send(err);
      }
      res.json(vehicle);
    });
  });



// Fire up server (using express)
app.listen(port);
console.log('Server listening on port ' + port);
