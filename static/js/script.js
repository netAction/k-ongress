// Coundown
$(function() {
	var unixtime = new Date().getTime();
	var unixtime = Math.floor(unixtime / 1000);

	var days = Math.floor((1444305600 - unixtime) / (3600*24));
	$('.timer').text('in '+days+' Tagen');
});


// Smooth scroll
$(function() {
	$('a[href*=#]').click(function() {
		var href =  $.attr(this, 'href');
		$('html, body').animate({
			scrollTop: $( href ).offset().top - 30
		}, 500);
		window.location.hash = href;
		return false;
	});
});



// Piwik
var _paq = [
	['trackPageView'],
	['enableLinkTracking'],
	['setTrackerUrl', 'https://piwik.netaction.de/piwik.php'],
	['setSiteId', 16]
];

if ($('#newname-name').length) {
	_paq.push(['setCustomVariable', 1, "Name", $('#newname-name').text(), "visit" ]);
	_paq.push(['trackGoal', 1]);
}


/*
Reset Database:
DELETE FROM piwik_archive_blob_2015_08 WHERE idsite = 16;
DELETE FROM piwik_archive_numeric_2015_08 WHERE idsite = 16;
DELETE FROM piwik_log_visit WHERE idsite = 16;
DELETE FROM piwik_log_link_visit_action WHERE idsite = 16;
DELETE FROM piwik_log_conversion WHERE idsite = 16;
DELETE FROM piwik_log_conversion_item WHERE idsite = 16;
*/
