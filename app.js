const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

var mresults = [];

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/static'));

const db = mysql.createConnection({
    host: '172.16.0.100',
    user: 'training_harsh',
    password: 'NEjuuEkk87#ki7e',
    database: 'training_harsh'
});

db.connect(function (err) {
    if (err) {
        console.log("err");

    }
    else {
        console.log("MySql Connected!!!");

    }
});


app.get('/', function (req, res) {
    res.render('index');
});

app.post('/createuser', function (req, res) {
    console.log(">>>>> Create user");
    console.log(req.body.dob);

    let data = {
        username: req.body.username,
        password: req.body.password,
        name: req.body.name,
        salary: req.body.salary,
        phone: req.body.phone,
        address: req.body.address,
        dob: req.body.dob,
        email: req.body.email,
        empType: req.body.selectType
    };

    let sql = "INSERT INTO employees SET ?";
    let query = db.query(sql, data, function (err, results) {
        if (err) throw err;
        res.redirect('/showd')
    });
});


/////////////////////////////////
var etype;
app.post('/filter', function (req, res) {
    etype = req.body.empType;
    console.log(">>>>>" + etype);
    res.redirect("/showd");

});

app.get('/showd', function (req, res) {

    //var etype = req.body.empType;
    console.log(">>>>>" + etype);
    if (etype && etype != 'All') {
        let sql = "SELECT *, DATE_FORMAT(dob, '%d/%m/%Y') FROM employees WHERE empType ='" + etype + "'";
        let query = db.query(sql, function (err, results, fields) {
            if (err) throw err;
            res.render("showt", { all_data: results });
        });
    } else {
        let sql = 'SELECT *, DATE_FORMAT(dob, "%d/%m/%Y") FROM employees';
        let query = db.query(sql, function (err, results, fields) {
            if (err) throw err;
            //console.log(results[0]['DATE_FORMAT(dob, "%d/%m/%Y")']);
            mresults = results;
            res.render("showt", { all_data: results });
        });
    }

});

//////////////


app.post('/edit', function (req, res) {
    var uname = req.body.uname;


    let sql = "SELECT *, DATE_FORMAT(dob, '%d/%m/%Y') FROM employees";
    let query = db.query(sql, function (err, results, fields) {
        if (err) throw err;
        //console.log(results[0].username);
        var d1;
        results.forEach(function (data) {
            if (uname == data.username) {
                d1 = data;
            }
        });
        console.log(d1);
        res.render('save', { data: d1 });
    });

});

app.post('/save', function (req, res) {
    var old_username = req.body.oldusername;
    var username = req.body.username;
    var password = req.body.password;
    var name = req.body.name;
    var salary = req.body.salary;
    var phone = req.body.phone;
    var address = req.body.address;
    var dob = req.body.dob;
    var email = req.body.email;
    


    let sql = 'UPDATE employees SET username = "' + username + '" , password = "' + password + '" , name = "' + name + '" , salary = ' + salary + ', phone = ' + phone + ' , address = "' + address + '" , dob = "' + dob + '" , email = "' + email + '"   WHERE username = "' + old_username + '"';

    let query = db.query(sql, function (err, results, fields) {
        if (err) throw err;
        res.redirect("/showd");
    });
});


app.post('/remove', function (req, res) {
    var uname = req.body.uname;
    //console.log(uname);

    let sql = 'DELETE FROM employees WHERE (username ="' + uname + '")';
    let query = db.query(sql, function (err, results, fields) {
        if (err) throw err;
        //console.log(results[0].username);
        res.redirect('/showd');
    });
    //console.log(req.body.uname);
});

app.post('/search', function (req, res) {
    var squery = req.body.sdata.toLowerCase();
    var newls = [];
    mresults.forEach(function (data) {
        if (data['username'].toLowerCase() == squery || data['password'].toLowerCase() == squery || data['name'].toLowerCase() == squery || data['salary'] == squery || data['phone'] == squery || data['dob'] == squery || data['email'].toLowerCase() == squery || data['empType'].toLowerCase() == squery || data['address'].toLowerCase() == squery) {
            newls.push(data);
        }
    });

    console.log(newls);
    res.render("showt", { all_data: newls });
})


app.listen(3000, function () {
    console.log("Server Started");

});