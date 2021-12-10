const express = require("express");
const mysql = require("mysql");
const ejs = require("ejs");


// Create express app
const app = express();

// Create a database connection configuration
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root123",
  database: "MusicVenue2", // comment out if running example 1
});

// Establish connection with the DB
db.connect((err) => {
  if (err) {
    throw err;
  } else {
    console.log(`Successful connected to the DB....`);
  }
});

// Initialize Body Parser Middleware to parse data sent by users in the request object
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // to parse HTML form data

// Initialize ejs Middleware
app.set("view engine", "ejs");
app.use("/public", express.static(__dirname + "/public"));

// routes
app.get("/", (req, res) => {
  res.render("index");
});
//create function to insert an account based on details entered. Automatically generates primary key.
app.post("/insertpurchaser", (req, res) => {
  let data1 = {ID: 0, Name: req.body.purchaserName, Email: req.body.purchaserEmail, Address: req.body.addressEntry, 
  DOB: req.body.purchaserDob, Password: req.body.purchaserPassword, Pnum: req.body.purchaserPnum};
  let sql1 = `INSERT INTO PURCHASER SET ?`;
  let query1 = db.query(sql1, data1, (err, result) => {
    if (err) {
        throw err;
      }
      res.send(`Account was added to the database.`);
  });
});

//shows all available seats that are not currently reserved.
app.get("/available", (req, res) => {
    let sql = `SELECT * FROM SEATING WHERE SEATING.ID IN (SELECT SEATING_ID FROM TICKET WHERE PURCHASER_ID='1')`;
    db.query(sql, (err, result) => {
      if (err) {
        throw err;
      }
      res.render("availability", { data: result });
    });
  });
  //renders home page
  app.get("/home", (req, res) => {
    let sql = `SELECT * FROM PURCHASER`;
    db.query(sql, (err, result) => {
      if (err) {
        throw err;
      }
      res.render("index", { data: result });
    });
  });
  //renders account page
  app.get("/account", (req, res) => {
    let sql = `SELECT * FROM PURCHASER`;
    db.query(sql, (err, result) => {
      if (err) {
        throw err;
      }
      res.render("account", { data: result });
    });
  });
  //renders page to enter information to submit a reservation based to selected ticket from previous page.
  app.post("/reserves", (req, res) => {
        let sql = `SELECT * FROM SEATING WHERE SEATING.Area =(SELECT SUBSTRING('${req.body.stuff}', 7, 3)) AND SEATING.Row =(SELECT SUBSTRING('${req.body.stuff}', 16, 3)) AND SEATING.Snum =(SELECT SUBSTRING('${req.body.stuff}', 33, 3))`;
        let query = db.query(sql, (err, result) => {
      if (err) {
        throw err;
      }
      res.render("reservation", { data: result });
    });
  });
//update operation. Uses the entered email and password to find account's ID, and then updates the foreign key in the ticket based on the seat they chose.
  app.post("/updateticket", (req, res) => {
    let data1=req.body.stuff;
    let area1=data1.substring(6, 9);
    let row1=data1.substring(15, 18);
    let seat1=data1.substring(32, 35);
    let sql = `UPDATE TICKET SET PURCHASER_ID=(SELECT ID FROM PURCHASER WHERE PURCHASER.Email='${req.body.purchaserEmail}' AND PURCHASER.Password='${req.body.purchaserPassword}') WHERE ID=(SELECT ID WHERE SEATING_ID=(SELECT ID FROM SEATING WHERE SEATING.Area ='${area1}' AND SEATING.Row ='${row1}' AND SEATING.Snum ='${seat1}'))`;
    let query = db.query(sql, (err, result) => {
        if (err) {           
            throw err;
        }
        res.send(`Ticket was reserved for entered account`);
    });
  });
  //rednders account info page (account login)
  app.get("/info", (req, res) => {
    let sql = `SELECT * FROM PURCHASER`;
    db.query(sql, (err, result) => {
      if (err) {
        throw err;
      }
      res.render("info", { data: result });
    });
  });
  //renders accountpage (account information) based on the entered email and password combination.
  app.post("/accountpage", (req, res) => {
    let sql = `SELECT * FROM PURCHASER WHERE PURCHASER.Email='${req.body.thingEmail}' AND PURCHASER.Password='${req.body.thingPassword}'`;
    db.query(sql, (err, result) => {
      if (err) {
        throw err;
      }
      res.render("accountpage", { data: result });
    });
  });
  //houses update, delete and read operations based on if statement. 
  //updates reservation to remove the fk of the deleted account based on the account id that matches the email and password.
  //deletes account based on the account id that matches the provided account name, email, and DOB.
  //reads and renders accountreservations based on what seating has a fk that matches the account id of the provided name, DOB, and email.
  //reads and renders editaccount page based on provided name and email.
  app.post("/deleteaccount", (req, res) => {  
      if(req.body.submit=="Delete Account")  {
    let sql1 = `UPDATE TICKET SET PURCHASER_ID='1' WHERE TICKET.ID=(SELECT ID WHERE PURCHASER_ID=(SELECT ID FROM PURCHASER WHERE PURCHASER.Name='${req.body.names}' AND PURCHASER.Email='${req.body.emails}'))`;
    let sql = `DELETE FROM PURCHASER WHERE ID =(SELECT ID WHERE Name='${req.body.names}' AND DOB='${req.body.dobs}' AND Email='${req.body.emails}')`;
    db.query(sql1, (err, result) => {
        if (err) {
          throw err;
        }
      });
      db.query(sql, (err, result) => {
          if (err) {
            throw err;
          }
          res.send(`Any active reservations removed and account deleted.`);
        });      
} else if(req.body.submit=="Reservations"){
          let sql1 = `SELECT * FROM SEATING WHERE SEATING.ID IN (SELECT SEATING_ID FROM TICKET WHERE PURCHASER_ID=(SELECT ID FROM PURCHASER WHERE Name='${req.body.names}' AND DOB='${req.body.dobs}' AND Email='${req.body.emails}'))`;
         
          db.query(sql1, (err, result) => {
              if (err) {
                throw err;
              }
              res.render("accountreservations", { data: result });
            });
      }else{
        let sql3 = `SELECT * FROM PURCHASER WHERE PURCHASER.Name='${req.body.names}' AND PURCHASER.Email='${req.body.emails}'`;
    db.query(sql3, (err, result) => {
      if (err) {
        throw err;
      }
      res.render("editaccount", { data: result });
    });
      }
  });
  //houses a read and update method based on if statement.
  //reads availableevent page (lists all events) .
  //updates ticket foreign key and removes accounts foreign key based on selected area, row, and seat number.
  app.post("/removereservation", (req, res) => {
    if(req.body.submit=="View Available Reservations"){
    let sql1 = `SELECT * FROM EVENT`;
    db.query(sql1, (err, result) => {
      if (err) {
        throw err;
      }
      res.render("availableevent", { data: result });
    });
}
else{       
    let data1=req.body.stuff;
    let area1=data1.substring(6, 9);
    let row1=data1.substring(15, 18);
    let seat1=data1.substring(32, 35);
    let sql = `UPDATE TICKET SET PURCHASER_ID='1' WHERE TICKET.ID=(SELECT ID WHERE SEATING_ID=(SELECT ID FROM SEATING WHERE SEATING.Area ='${area1}' AND SEATING.Row ='${row1}' AND SEATING.Snum ='${seat1}'))`;
    db.query(sql, (err, result) => {
      if (err) {
        throw err; 
      }
      res.send(`Reservation removed from account`);
    });}
  });
  //update methods to update any and every piece of information included in the account page based on information that is related to account
  //reference information changes to ensure it is not refering to information that is being changed in request.
  app.post("/editaccount", (req, res) => {
      if(req.body.names){
    let sql = `UPDATE PURCHASER SET Name='${req.body.names}' WHERE ID=(SELECT ID WHERE Email='${req.body.emails}' AND Password='${req.body.pass}')`;
    db.query(sql, (err, result) => {
      if (err) {
        throw err;
      }
    });
      }
    let sql1 = `UPDATE PURCHASER SET Email='${req.body.emails}' WHERE ID=(SELECT ID WHERE Name='${req.body.names}' AND Password='${req.body.pass}')`;
    db.query(sql1, (err, result) => {
      if (err) {
        throw err;
      }
    });
    let sql2 = `UPDATE PURCHASER SET DOB='${req.body.dobs}' WHERE ID=(SELECT ID WHERE Email='${req.body.emails}' AND Password='${req.body.pass}')`;
    db.query(sql2, (err, result) => {
      if (err) {
        throw err;
      }
    });
    let sql3 = `UPDATE PURCHASER SET Password='${req.body.pass}' WHERE ID=(SELECT ID WHERE Email='${req.body.emails}' AND Name='${req.body.names}')`;
    db.query(sql3, (err, result) => {
      if (err) {
        throw err;
      }
    });
    let sql4 = `UPDATE PURCHASER SET Pnum='${req.body.phones}' WHERE ID=(SELECT ID WHERE Email='${req.body.emails}' AND Password='${req.body.pass}')`;
    db.query(sql4, (err, result) => {
      if (err) {
        throw err;
      }
    });
    let sql5 = `UPDATE PURCHASER SET Address='${req.body.addr}' WHERE ID=(SELECT ID WHERE Email='${req.body.emails}' AND Password='${req.body.pass}')`;
    db.query(sql5, (err, result) => {
      if (err) {
        throw err;
      }
    });
    res.send(`Account updates applied.`);
  });
  //renders availableevent page (lists all events).
  app.get("/events", (req, res) => {
    let sql = `SELECT * FROM EVENT`;
    db.query(sql, (err, result) => {
      if (err) {
        throw err;
      }
      res.render("availableevent", { data: result });
    });
  });
  //renders eventschedules page (lists times for selected event) based on provided event name from last page.
  app.post("/eventtimes", (req, res) => {
    let data1=req.body.stuff;
    eventname=data1.substring(6, 10);
    genre=data1.substring(16, 17);
    let sql = `SELECT * FROM SCHEDULE WHERE ID=(SELECT SCHEDULE_ID FROM EVENT WHERE Name LIKE '%${eventname}%')`;
    db.query(sql, (err, result) => {
      if (err) {
        throw err;
      }
      res.render("eventschedules", { data: result });
    });
  });
  //read and search operation and renders availeventsearch pacge (returns all events matching words from search).
  //returns all events that contain part of the provided string, matching to either the event name, 
  //the schedule day, the schedule month, or the schedule year
  app.post("/searchstuff", (req, res) => {
    let data1=req.body.eventSearch;  
    let sql = `SELECT * FROM EVENT WHERE ID IN (SELECT ID FROM EVENT WHERE Name LIKE '%${data1}%' OR SCHEDULE_ID IN (SELECT ID FROM SCHEDULE WHERE Day LIKE '%${data1}%' OR Month LIKE '%${data1}%' OR Year LIKE '%${data1}%'))`;
    db.query(sql, (err, result) => {
      if (err) {
        throw err;
      }
      res.render("availeventsearch", { data: result });
    });
  });
  //read operation, renders availability page based on selected time.
  //pulls the day, month, and year out and finds the seats that match that event's shcedule's day, month, and year
  app.post("/eventsearchticket", (req, res) => {
    let data1=req.body.stuff;
    let Day=data1.substring(9, 11);
    let Month=data1.substring(0, 8);
    let Year=data1.substring(15, 19);
    let sql = `SELECT * FROM SEATING WHERE SEATING.ID IN (SELECT SEATING_ID FROM TICKET WHERE PURCHASER_ID='1') AND EVENT_ID=(SELECT ID FROM EVENT WHERE SCHEDULE_ID=(SELECT ID FROM SCHEDULE WHERE Day LIKE '%${Day}%' AND Month LIKE '%${Month}%' AND Year LIKE '%${Year}%'))`;
    db.query(sql, (err, result) => {
      if (err) {
        throw err;
      }
      res.render("availability", { data: result });
    });
  });

// Setup server ports
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));