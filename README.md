# k-ongress

K-ongress is a tiny *nodejs* page using *express* and *mysql* for small congresses.

It allows users to register for sessions. They will get a notification email via *nodemailer*.




## Installation

	$ npm install

	cp config-template.js config.js

    CREATE TABLE `registrations` (
      `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
      `email` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
      `session` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
      `session_detail` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
      `school` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
      `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (`email`),
      KEY `email` (`email`)
    ) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
