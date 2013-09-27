#Websocket Scoreboard#

This is a simple demo of websockets 

The app provides two different interfaces. One is an admin screen where the game moderator (or scorekeeper) updates the points scored by each team in the game. The other screen is the one consumed by the audience - it has no controls, just a UI that updates in realtime when the scorekeeper updates the scores from his side. A nodejs server runs in the background which sends push notification via websockets. Both the admin interface and client-scoreboard interface connect to the server. When the admin updates the points scored by a team, the client-scoreboard interface updates automatically.



###Usage:###
**Install yamljs, sockets.io**

	npm install yamljs sockets.io

**Run nodejs server in admin folder**
	
	node adminServer.js
	
**Open admin interface as "localhost:1337"**
**Open client scoreboard from a different computer**

![alt tag](https://github.com/paragmajum/websocket-scoreboard/blob/master/img/websockets-scoreboard.jpg)