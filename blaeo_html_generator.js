// ==UserScript==
// @name         BLAEO Game Post Generator
// @namespace    https://www.backlog-assassins.net/
// @version      0.2
// @description  add a button on game list to generate an html post for each game
// @author       JulLeBarge
// @match        https://www.backlog-assassins.net/users/*/games
// @match        https://www.backlog-assassins.net/*/games/*
// @match        https://www.backlog-assassins.net/lists/*
// ==/UserScript==

(function() {
    'use strict';

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
			/*console.log("tempAchPourcent: " + tempAchPourcent);
			console.log("tempAchNb: " + tempAchNb);
			console.log("tempAchTotal: " + tempAchTotal);
            console.log("appid= " + appid);
			console.log("appname: " + appname);
			console.log("apptime: " + apptime);
			console.log("appachievements: " + appachievements);*/

			var tempHtml = "<li><textarea rows=1 cols=25>";
            tempHtml += "<div class='panel panel-success'>";
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
            tempHtml += "</textarea></li>";
			tempHtml = tempHtml.replace(/'/g, '"');
            var $icon = $(tempHtml).insertAfter($row.find('li:nth-child(2)'));
            icons.push($icon);
        });
	};

    $(document).ready(addPostGenerator);

})();
