var config = require('./config.js');

// Express
var express = require('express');
var app = express();


// MySQL
var mysql      = require('mysql');
var mysqlPool = mysql.createPool(config.mysql);



// E-Mail
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport(config.nodemailerTransporter);

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





function sessionsRender(res, error, newname) {
	mysqlPool.query('SELECT session, COUNT (*) AS guests FROM registrations GROUP by session', function(err, results) {
		if (err) throw err;
		guestCounts = {};
		results.forEach(function(session) {
			guestCounts[session.session] = session.guests;
		});

		res.render('index', { guestCounts: guestCounts, error:error, newname: newname });
	});
}

app.get('/', function (req, res) {
	sessionsRender(res);
});

app.post('/', function (req, res) {
	if(!req.body.name) {
		error = "name missing"; sessionsRender(res, error, newName); return;
	}
	if(!req.body.email) {
		error = "email missing"; sessionsRender(res, error, newName); return;
	}
	if(!req.body.school) {
		error = "school missing"; sessionsRender(res, error, newName); return;
	}
	if(!req.body.session) {
		error = "session missing"; sessionsRender(res, error, newName); return;
	}


	var registration =  {
		name: req.body.name.trim(),
		email: req.body.email.trim(),
		school: req.body.school.trim(),
		session: req.body.session.trim(),
	};

	var error = false;
	var newName = '';

	// Input invalid?
	if(!validateString(registration.name)) {
		error = "name invalid";
		sessionsRender(res, error, newName);
		return;
	}
	if(!validateEmail(registration.email)) {
		error = "email invalid";
		sessionsRender(res, error, newName);
		return;
	}

	mysqlPool.query('INSERT INTO registrations SET ?', [registration], function(err, results) {
		if (err) {
			var error = 'database error';
			if (err.errno == 1062) error='duplicate entry';
		} else {
			var newName = req.body.name.trim();
			sendMail(
				registration.email,
				'Du bist beim Lehrerinnen-Erzieherinnen-Nachmittag dabei!',
				'Hallo '+newName+'!\n\n'+
				'Willkommen beim Lehrerinnen-Erzieherinnen-Nachmittag, wir freuen uns, dich am 13. Oktober 2015 zu sehen.\n'+
				(registration.session=='basis'?'Für dich ist ein Platz bei der Basis-Schulung reserviert.':'')+
				(registration.session=='pumpe'?'Für dich ist ein Platz beim Seminar „Insulinpumpe für Anfänger“ reserviert.':'')+
				(registration.session=='psycho'?'Für dich ist ein Platz beim Seminar „Psychoemotionale Aspekte“ reserviert.':'')+
				(registration.session=='inklusion'?'Für dich ist ein Platz beim Inklusions-Seminar reserviert.':'')+
				'\n\nBei Änderungen und Rückfragen erreichst du uns unter Telefon oder per Antwort auf diese Mail.'+
				'\n\nDein Team des Sozialpädiatrischen Zentrum');
		}

		sessionsRender(res, error, newName);
	});



}); // POST



app.get('/k-ontrol', function (req, res) {
	mysqlPool.query('SELECT * FROM registrations', function(err, results) {
		if (err) throw err;
		res.render('k-ontrol', { registrations: results });
	});
});



// Server
var server = app.listen(8004, function () {

	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);

});




