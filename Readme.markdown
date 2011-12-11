[compactGraph.js example](http://schlather.info/holdengraph/example-compactGraph.html)

[holdengraph.js example](http://schlather.info/holdengraph/example-holdengraph.html)

This project has two JavaScript / HTML5 Canvas demoes that I put together to help in system monitoring at Holden Village. 

The first one, compactGraph.js, was written in response to a request by Rich Wilson. There are about a dozen Linux/ARM boards that control heating and electrical load throughout the village. Rich was looking for a way to generate graphs onboard, and because of the system constraints generating images was out of the question. However, the systems all have embedded webservers, so I gave him a format he could dump an array into representing the past day of temperatures at 5-minute intervals, and browsers could do the heavy lifting of actually drawing the graph. 

The second one was written for a Twisted/Python monitoring daemon I put together to monitor the controllers and the load. I gradually realized I was reinventing Nagios, so I've moved most of the monitoring over to Nagios, but holdengraph.js is still an interesting tech demo.

The format for both of them is fairly simple and self explanatory. They consist of an associative array with some options about how you want the graph to display; maximum values, how many hash marks should be drawn on the axis, color, and so on. The graphs in holdengraph.js are designed to show some Y-values dependent on an X-value. It expects one array with all the X-values (in the example below, Unix timestamps) and then another array of associative arrays describing each of the Y-values, with their data.

An important thing about holdengraph.js is that you need to make sure that all of the data arrays have the same length. If the X-value array is differently sized from any of the Y-value arrays behavior is undefined.


