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
