var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    port: "3306",
    password: "shaurya"
});

con.connect((err) =>
{
    if(err) {
       throw err;
    } else {
        console.log("connected");
        con.query("use OYE_RICKSHAW;", function(err,result){
        if(err)
           throw err;
        else {
            console.log("database used");
        }
    });
    }
});

var app = express();
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/newCustomer",(req,res) => {
    res.render("customer.ejs");
});

app.get("/newDriver",(req,res) => {
    res.render("driver.ejs");
});

app.get("/newRide",(req,res) => {
    res.render("ride.ejs");
});

app.get("/customerAddRating",(req,res) => {
    res.render("customerAddRating.ejs");
});

app.get("/driverAddRating",(req,res) => {
    res.render("driverAddRating.ejs");
});

app.post("/newCustomerPOST", (req,res) => {
    var userName = req.body.userName;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var phoneNumber = req.body.phoneNumber;
    var emailId = req.body.emailId;
    var passWord = req.body.passWord;
    var sqlQuery=`INSERT into Customers(UserName, FirstName, LastName, PhoneNo, 
        Email, PassWord, OYE_Money) values("${userName}","${firstName}", "${lastName}",
        "${phoneNumber}","${emailId}","${passWord}",0);`;
    con.query(sqlQuery, (err, result) => {
        if (err) {
            throw err;
        } else {
            res.send("New Customer added "+userName);
        }
    });
});

app.post("/newDriverPOST",(req,res) => {
    var userName = req.body.userName;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var phoneNumber = req.body.phoneNumber;
    var emailId = req.body.emailId;
    var passWord = req.body.passWord;
    var sqlQuery=`INSERT into Drivers(UserName, FirstName, lastName, PhoneNo, Email, PassWord)
        values("${userName}","${firstName}","${lastName}","${phoneNumber}","${emailId}","${passWord}");`;
    con.query(sqlQuery, (err, result) => {
        if (err) {
            throw err;
        } else {
            res.send("New Driver added "+userName);
        }
    });
});

app.post("/newRidePOST",(req,res) => {
    var rideId = req.body.rideId;
    var customerId = req.body.customerId;
    var driverId = req.body.driverId;
    var fromLocation = req.body.fromLocation;
    var toLocation = req.body.toLocation;
    var sqlQuery=`INSERT into Rides(RideId, CustomerID, DriverID, From_Location, 
        To_Location, CustomerRating, DriverRating) values("${rideId}",
        "${customerId}","${driverId}","${fromLocation}","${toLocation}",0,0);`;
    con.query(sqlQuery, (err, result) => {
        if (err) {
            throw err;
        } else {
            res.send("New ride added ");
        }
    });
});

app.post("/customerAddRatingPOST",(req,res) => {
    var rideId = req.body.rideId;
    var customerId = req.body.userName;
    var rating = req.body.rating;
    console.log(req.body);
    var sqlQuery = `UPDATE Rides set DriverRating = ${rating} where 
                CustomerID ='${customerId}' and RideId ='${rideId}';`;
    console.log(sqlQuery);
    con.query(sqlQuery, (err, result) => {
        if (err) {
            throw err;
        } else {
            res.send("Customer " + customerId +" added a rating for driver on ride " + rideId);
        }
    });
});
  
app.post("/driverAddRatingPOST",(req,res) => {
    var rideId = req.body.rideId;
    var driverId = req.body.userName;
    var rating = req.body.rating;
    var sqlQuery = `UPDATE Rides SET CustomerRating = ${rating}
                    where DriverID = "${driverId}" and RideId = "${rideId}";`;
    con.query(sqlQuery, (err, result) => {
        if (err) {
            throw err;
        } else {
            res.send("Driver " + driverId +" added a rating for customer on ride " + rideId);
        }
    });
});

app.get("/customer/:userName",(req,res) => {
    console.log(req.params.userName);
    var userName=req.params.userName;
    var sqlQuery=`SELECT t1.UserName, t1.FirstName, t1.LastName, t1.PhoneNo, t1.Email, t1.OYE_Money, AVG(t2.CustomerRating) as AVGRating 
    FROM Customers t1 INNER JOIN Rides t2 ON t2.CustomerID=t1.UserName where UserName='${userName}';`;
    
    con.query(sqlQuery, (err,result) => {
    if(err) {
         throw err;
    } else {
        var customerDetails = result[0];
        res.send(customerDetails);
    }
    });
});

app.get("/driver/:userName",(req,res) => {
    console.log(req.params.userName);
    var userName=req.params.userName;
    var sqlQuery=`SELECT t1.UserName, t1.FirstName, t1.LastName, t1.PhoneNo, t1.Email, AVG(t2.DriverRating) as AVGRating
    FROM Drivers t1 INNER JOIN Rides t2 ON t2.DriverID=t1.UserName where UserName='${userName}';`;
    
    con.query(sqlQuery,(err,result) => {
    if(err) {
         throw err;
    } else {
        var customerDetails = result[0];
        res.send(customerDetails);
    }
    });
});

app.listen(8080,function()
{
    console.log("Server has started");
});