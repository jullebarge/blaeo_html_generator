// ==UserScript==
// @name         BLAEO Game Post Generator with Button
// @namespace    https://www.backlog-assassins.net/
// @version      0.5
// @description  add a button on game list to generate an html post for each game
// @author       JulLeBarge
// @match        https://www.backlog-assassins.net/users/*/games
// @match        https://www.backlog-assassins.net/*/games/*
// @match        https://www.backlog-assassins.net/lists/*
// @grant        GM_setClipboard
// @require      https://raw.githubusercontent.com/kamranahmedse/jquery-toast-plugin/bd761d335919369ed5a27d1899e306df81de44b8/dist/jquery.toast.min.js
// ==/UserScript==

function injectStylesheet(url) {
    $('head').append('<link rel="stylesheet" href="'+url+'" type="text/css" />');
}

(function() {
    'use strict';

    injectStylesheet("https://cdn.rawgit.com/kamranahmedse/jquery-toast-plugin/bd761d335919369ed5a27d1899e306df81de44b8/dist/jquery.toast.min.css");

	var addPostGenerator = function() {
		if (!$('.game-table').length) {
            // thumbnail view or list view; nothing to do here
            return;
        }

		// add icon to each game cell
        var icons = [];
        $('.game-table tbody tr').each(function() {
            var $row = $(this);
            var appid = /\/(\d+)$/.exec($row.find('a.steam').attr('href'))[1];
			var $tds = $row.find('td');
			var appname = $tds.eq(1).clone().find('a').remove().end().text().replace(/(\r\n|\n|\r)/gm,"");
            var appachievements = "";
            var apptime = "";
			if ($tds.count == 4){
				//console.log("4 colonnes");
				appachievements = $tds.eq(3).text().replace(/(\r\n|\n|\r)/,"");
				apptime = $tds.eq(4).text() + " playtime";
			}
			else {
				//console.log("3 colonnes");
				appachievements = $tds.eq(3).text().replace(/(\r\n|\n|\r)/,"");
				apptime = $tds.eq(2).text() + " playtime";
			}

			var tempAch = appachievements.split("\n");
			var tempAchPourcent = tempAch[0];
            var tempAchNb = tempAch[1].slice(1, tempAch[1].indexOf(' '));
			var tempAchTotal = tempAch[1].slice(tempAch[1].lastIndexOf(' '),tempAch[1].length-1);

			appachievements = tempAchNb + " of " + tempAchTotal + " achievements (" + tempAchPourcent + ")";

			var tempHtml = "<div class='panel panel-success'>";
			tempHtml += "<div class='panel-heading' data-toggle='collapse' data-target='#post-" +  appid + "' aria-expanded='true'>";
			tempHtml += "<div class='game game-beaten game-media' data-item='data-" + appid + "'>";
			tempHtml += "<div style='float: left; padding-right: 10px;'>";
			tempHtml += "<a href='http://store.steampowered.com/app/" + appid + "'>";
			tempHtml += "<img alt='" + appname + "' src='https://steamcdn-a.akamaihd.net/steam/apps/" + appid + "/capsule_184x69.jpg'></a>";
			tempHtml += "</div><div class='media-body'>";
			tempHtml += "<h4 class='media-heading'>" + appname + "</h4>";
			tempHtml += "<span>NOTE</span><br>" + apptime + ", <a href='http://steamcommunity.com/id/jullebarge/stats/" +  appid + "/?tab=achievements'>" +  appachievements + "</a>";
			tempHtml += "</div></div></div><div id='post-" +  appid + "' class='panel-body collapse' aria-expanded='false' style=''>";
			tempHtml += "<font color='green'><b>Pros:</b></font><br><br><font color='red'><b>Cons:</b></font><br><br><font color='blue'><b>Conclusion:</b></font></div></div>";

			tempHtml = tempHtml.replace(/'/g, '"');

            var buttonHtml = "<li><a class='fa fa-clipboard' style='text-decoration:none;' id='Button-" +  appid + "' href='#'><i></i></a></li>";
            var $icon = $(buttonHtml).insertAfter($row.find('li:nth-child(2)'));

			document.getElementById ("Button-" +  appid).addEventListener (
				"click", function () {
				GM_setClipboard(tempHtml);
				//alert("Html copied in the clipboard");
                //GM_notification("Html code copied in the clipboard", "BLAEO",'https://www.backlog-assassins.net/logo-32x32.png', false, 50);
                    $.toast({
                        text: 'Html code copied in the clipboard',
                        heading: 'BLAEO', // Optional heading to be shown on the toast
                        loader: false,
                        icon: 'success',
                        loaderBg: '#9EC600',
                        showHideTransition: 'fade', // fade, slide or plain
                        allowToastClose: false, // Boolean value true or false
                        hideAfter: 1000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
                        stack: false, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                        position: 'bottom-center',
                        bgColor: '#7e7',
                        textColor: 'black'
                    });
				}, false
			);
            icons.push($icon);
        });
	};

    $(document).ready(addPostGenerator);

})();
