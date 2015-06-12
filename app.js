// Express
var express = require('express');
var app = express();


// MySQL
var mysql      = require('mysql');
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'kongress',
	password : '5pYMM8uNxhaMAXta',
	database : 'kongress',
});
connection.connect();


// E-Mail
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'formmail@netaction.de',
		pass: '#######'
	}
});

function sendMail(to, subject, text) {
	transporter.sendMail({
		from: 'formmail@netaction.de',
		replyTo: 'bla@netaction.de',
		to: to,
		subject: subject,
		text: text,
	});
}


// POST middleware
var bodyParser     =        require("body-parser");
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));



// String validation
function validateEmail(email) {
	var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
	return re.test(email);
}
function validateString(string) {
	return (string.length > 3);
}


// Pages
app.use(express.static('static'));
app.set('view engine', 'jade');
app.locals.pretty = true;

app.get('/', function (req, res) {
		res.render('index', {  });
});



function sessionsRender(res, error, newname) {
	connection.query('SELECT session, COUNT (*) AS guests FROM registrations GROUP by session', function(err, results) {
		if (err) throw err;
		guestCounts = {};
		results.forEach(function(session) {
			guestCounts[session.session] = session.guests;
		});

		res.render('seminare', { guestCounts: guestCounts, error:error, newname: newname });
	});
}

app.get('/seminare', function (req, res) {
	sessionsRender(res);
});

app.post('/seminare', function (req, res) {
	var registration =  {
		name: req.body.name.trim(),
		email: req.body.email.trim(),
		school: req.body.school.trim(),
		session: req.body.session.trim(),
	};

	var error = false;
	var newName = '';

	// Input invalid?
	if( !(
		validateString(registration.name) &&
		validateEmail(registration.email) &&
		validateString(registration.school))) {

		error = "form invalid";
		sessionsRender(res, error, newName);
		return;
	}


	connection.query('INSERT INTO registrations SET ?', [registration], function(err, results) {
		if (err) {
			var error = 'database error';
			if (err.errno == 1062) error='duplicate entry';
		} else {
			var newName = req.body.name.trim();
			sendMail(registration.email, 'Du bist beim Lehrer-Erzieher-Nachmittag dabei!', 'Komm, '+newName);
		}

		sessionsRender(res, error, newName);
	});



}); // POST seminare



app.get('/k-ontrol', function (req, res) {
	connection.query('SELECT * FROM registrations', function(err, results) {
		if (err) throw err;
		console.log(results);
		res.render('k-ontrol', { registrations: results });
	});
});



// Server
var server = app.listen(3000, function () {

	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);

});






// MySQL
//connection.end();
