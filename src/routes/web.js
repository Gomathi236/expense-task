require("dotenv").config();
import express from "express";
import loginController from "../controllers/loginController";
import signupController from "../controllers/signupController";
import homePageController from "../controllers/homeController";
import auth from "../validation/authValidation";
import passport from "passport";
import initPassportLocal from "../controllers/passportLocalController";
import connection from "../configs/connectDB";
import profileController from "../controllers/profileController";
import contactusController from "../controllers/contactusController";
import addsourceController, {getsourcePage} from "../controllers/addsourceController";
import { urlencoded } from "body-parser";

let router = express.Router();

initPassportLocal();

router.get("/", loginController.checkLoggedIn, homePageController.getHomePage);

router.get("/login",loginController.checkLoggedOut,loginController.getLoginPage);
router.post("/login",passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    successFlash: true,
    failureFlash: true,
  })
);
router.get("/signup", signupController.getsignupPage);
router.post("/signup", auth.validateSignup, signupController.createNewUser);

router.get("/addsource", (req, res) => {
  res.render("addsource", { message: null });
});
router.get("/category", (req, res) => {
  res.render("category");
});

//income

router.get('/income', function(req, res, next) {
  res.render('income');
});
router.get('/home', function(req, res, next) {
  res.render('home');
});
 
router.post('/income', function(req, res, next) {
  let data =req.body || null;
  var date = req.body.date || null;
  var source = req.body.source || null;
  var description = req.body.description || null;
  var amount = req.body.amount || null;
  var sql = `INSERT INTO income (date, source, description, amount) VALUES ("${date}", "${source}", "${description}", "${amount}")`;
  connection.query(sql, function(err, result) {
    if (err) throw err;
    console.log('record inserted');
    req.flash('success', 'Data added successfully!');
    res.redirect("/home");
  });
});


//addsource

router.get("/addsource", function (req, res, next) {
  res.render("addsource");
});
router.get("/income", function (req, res, next) {
  res.render("income");
});

router.post("/addsource", function (req, res, next) {
  var type = req.body.type;
  
  console.log(req.body);

  var sql = `INSERT INTO income_type (type) VALUES ("${type}")`;
  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("record inserted");
    req.flash("success", "Data added successfully!");

    res.render("income",{data :  req.body})
  });
});


//expenses
router.get("/expenses", function (req, res, next) {
  
  res.render("expenses");
});
router.get("/home", function (req, res, next) {
  res.render("home");
});

router.post("/expenses", function (req, res, next) {
  var date = req.body.date || null;
  var category = req.body.Category || null;
  var description = req.body.description | null;
  var amount = req.body.amount || null;

  
  var sql = `INSERT INTO expenses (date, category,  description, amount) VALUES ("${date}", "${category}", "${description}", "${amount}")`;
  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("record inserted");
    req.flash("success", "Data added successfully!");
    res.redirect("/home");
  });
});

//expense type 
router.get("/expensetype", function (req, res, next) {
  res.render("expensetype");
});
router.get("/expenses", function (req, res, next) {
  res.render("expenses");
});

router.post("/expensetype", function (req, res, next) {
  var name = req.body.name;
  var budget = req.body.budget;
  console.log(req.body);

  var sql = `INSERT INTO expense_type (name,budget) VALUES ("${name}", "${budget}")`;
  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("record inserted");
    req.flash("success", "Data added successfully!");

    res.render("expenses",{data:req.body})
  });
});


//contactus
router.get("/contactus", function(req,res){
  res.render("contactus")
});
router.get("/contactsuccess",function(req,res){
  res.render("contactsuccess")
})

router.post ("/contactus",function(req,res){
  var name = req.body.name;
  var query = req.body.query;
  var email = req.body.email;
  console.log(req.body);

  var sql = `INSERT INTO contact_us (name,query,email) VALUES ("${name}", "${query}","${email}")`;
  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("record inserted");
    req.flash("success", "Data added successfully!");
    res.render("contactsuccess",{data: req.body});
    
  });
});


router.get("/profile", profileController.getProfilePage);
router.get("/addsource",addsourceController.getsourcePage,addsourceController.addSource);

router.post("/logout", loginController.postLogOut);

module.exports = router;
