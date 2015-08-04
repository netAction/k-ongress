$(function() {
	var unixtime = new Date().getTime();
	var unixtime = Math.floor(unixtime / 1000);

	var days = Math.floor((1444305600 - unixtime) / (3600*24));
	$('.timer').text('in '+days+' Tagen');
});
