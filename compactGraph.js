function log10(val) {
    return Math.log(Math.abs(val))/Math.log(10);
}
var graphContext =  {
    graphPadding : 0,
    unitX :  0,
    unitY :  0,
    offsetY : 0,
    make : function (canvasWidth,canvasHeight,maxX,minX,maxY,minY,padding) {
	this.graphPadding=padding;
	this.unitX =    (canvasWidth -  padding) / (maxX-minX)  ;
	this.unitY = -( (canvasHeight - padding) / (maxY-minY) );
	this.xMin = minX;
	this.xMax = maxX;
	this.yMin = minY;
	this.yMax = minY;
	this.offsetY = ((maxY-minY) * this.unitY);
    },
    getX : function(value) {
	return this.graphPadding + ((value-this.xMin)*this.unitX);
    },
    getY : function(value) {
	return  (((value-this.yMin) *  this.unitY) - this.offsetY);
    },
}


function draw(){
    blank=2;
    for (j=0;j<graphs.length;++j) {
	graph = graphs[j];
	var canvas = document.createElement('canvas');
	if (canvas.getContext){
	    canvas.setAttribute('id',graph.title);
            var ctx = canvas.getContext('2d');
            canvas.width=640;
            canvas.height=480;

	    var debug=0;
	    if (debug) {
		ctx.scale(.5,.5);
		ctx.translate(800,600);
	    }
	    

	    timeMin=graph.timeMin;
	    timeMax=graph.timeMax;
	    tempMin=graph.tempMin;
	    tempMax=graph.tempMax;
	    
	    for (var i = 0;i<graph.data.length;i++) {
		var time = i*graph.timeStep;
		var temp = graph.data[i];
		if ( parseFloat(temp) < parseFloat(tempMin) ) {
		    tempMin=temp;
		}
		if (parseFloat( temp) > parseFloat(tempMax) ){
		    tempMax=temp;
		}
	    }

	    /* These define the values you need to translate and scale
	     * a point in the plane of the graph to a point in the
	     getX : function(value) {
	     return realX = graphPadding + ((value-xMin)*unitX);
	     }
	     * plane of the canvas so the graph shows at the desired
	     * size (the dimensions of the canvas.) */
	    var graphPadding = 30 + 20*(Math.max(log10(tempMin),log10(tempMax)));
	    var strokeLength=5;
	    trans = graphContext;
	    trans.make(canvas.width,canvas.height,timeMax,timeMin,tempMax,tempMin,graphPadding);
	    now = new Date();

	    // Draw the markings on the axis, with value labels
	    var start=timeMin;
	    if (graph.type == "tgraph") {
		// get the number of milliseconds since the Epoch
		// for the most recent hour
		var minutes = now.getMinutes();
		var mostRecentHour = now.getTime() - (1000*60*minutes) - 1000*now.getSeconds();

//		ctx.fillText(new Date(mostRecentHour).toLocaleTimeString(),200,200);
		var firstMark = now.getHours();
		if (minutes!=0) { ++firstMark; }
		for (var i=( 12 - minutes/5 );i<288 ; i+=12)
		{
		    realX = trans.getX(i);
		    ctx.moveTo(realX,canvas.height-graphPadding);
		    ctx.lineTo(realX,canvas.height - strokeLength - graphPadding);
		    ctx.stroke();
		    ctx.fillText((firstMark++)%24,realX,canvas.height-graphPadding/2);
		}
	    } else {
		// don't trust graphs that aren't tgraphs to work, untested
		for (var i=timeMin;i<timeMax ; i+=graph.timeMarks)
		{
		    ctx.moveTo(trans.getX(i),canvas.height-graphPadding);
		    ctx.lineTo(trans.getX(i),canvas.height - strokeLength - graphPadding);
		    ctx.stroke();
		}
	    }
	    for (var i=tempMin;i<tempMax;i+=graph.tempMarks) 
	    {
		var realY = trans.getY(i);
		ctx.moveTo(graphPadding,realY);
		ctx.lineTo(graphPadding+strokeLength,realY);
		ctx.stroke();
		ctx.fillText(i,graphPadding/2,realY);
	    }

	    //Draw the axis labels
	    ctx.font="14px Arial";
	    ctx.fillText(graph.labelX,canvas.width/5,canvas.height-4);
	    ctx.rotate(- Math.PI/2 );
	    ctx.fillText(graph.labelY,-canvas.height/2,14);
	    ctx.rotate( Math.PI/2 );
	    

	    // Plot the data
	    var show = 12;
	    ctx.moveTo(
		graphPadding,
		trans.getY(graph.data[0])
	    );
	    for (var i = 0;i<graph.data.length;i++) {
		ctx.lineTo(
		    trans.getX(i*graph.timeStep),
		    trans.getY(graph.data[i])
		);
/*		if((i%20)==0) {
		    ctx.fillText("[" + i + ", " + graph.data[i] + "]",trans.getX(i*graph.timeStep),trans.getY(graph.data[i]))
		}*/
		++show;
	    }
	    ctx.stroke();

	    // Draw the axes. 
	    ctx.moveTo(graphPadding,canvas.height-graphPadding);
	    ctx.lineTo(graphPadding,0);
	    ctx.stroke();

	    ctx.moveTo(graphPadding,canvas.height-graphPadding);
	    ctx.lineTo(canvas.width,canvas.height-graphPadding);
	    ctx.stroke();

	    // Insert the graph at the end of the document.
	    document.childNodes[1].appendChild(canvas);
	    
	}
    }
}