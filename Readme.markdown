
This project has two JavaScript / HTML5 Canvas demoes that I put together to help in system monitoring at Holden Village. 

The first one, compactGraph.js, was written in response to a request by Rich Wilson. There are about a dozen Linux/ARM boards that control heating and electrical load throughout the village. Rich was looking for a way to generate graphs onboard, and because of the system constraints generating images was out of the question. However, the systems all have embedded webservers, so I gave him a format he could dump an array into representing the past day of temperatures at 5-minute intervals, and browsers could do the heavy lifting of actually drawing the graph. 

The second one was written for a Twisted/Python monitoring daemon I put together to monitor the controllers and the load. I gradually realized I was reinventing Nagios, so I've moved most of the monitoring over to Nagios, but holdengraph.js is still an interesting tech demo.

[example-holdengraph.js](http://schlather.info/example-holdengraph.js)
[example-compactGraph.js](http://schlather.info/example-compactGraph.js)
