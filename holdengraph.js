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
  //parseInt inexplicably stops Firefox from hanging for 60+ seconds on the load controller graph.
  getX : function(value) {
    return parseInt(this.graphPadding + ((value-this.xMin)*this.unitX));
  },
  getY : function(value) {
    return  parseInt(((value-this.yMin) *  this.unitY) - this.offsetY);
  }
}


function draw(){
  blank=2;
  for (graphIndex=0;graphIndex<graphs.length;++graphIndex) {
    graph = graphs[graphIndex];
    var canvas = document.createElement('canvas');
    document.childNodes[1].appendChild(canvas);

    if (canvas.getContext){
      canvas.setAttribute('id',graph.title);
      var ctx = canvas.getContext('2d');
      canvas.width=graph.width;
      canvas.height=graph.height;

      var debug=0;
      if (debug) {
	ctx.scale(.5,.5);
	ctx.translate(800,600);
      }

      timeMin=parseFloat(graph.timeMin);
      timeMax=parseFloat(graph.timeMax);
      if (isNaN(timeMin)) {
	timeMin=Number.POSITIVE_INFINITY;
      }
      if (isNaN(timeMax)) {
	timeMax=Number.NEGATIVE_INFINITY;
      }
      for (var i = 0; i < graph.xVar.length; ++i) {
	var val= parseFloat(graph.xVar[i]);
	if (val  < timeMin)  {
	  timeMin=val;
	}
	if (val  > timeMax)  {
	  timeMax=val;
	}

      }
      tempMin=parseFloat(graph.tempMin);
      tempMax=parseFloat(graph.tempMax);

      for (var j = 0; j < graph.yVars.length;++j) {

	for (var i = 0;i<graph.yVars[j].data.length;i++) {
	  /* var time = i*graph.timeStep;
	   var temp = graph.data[i]; */
	  var temp = parseFloat(graph.yVars[j].data[i]);
	  if ( temp < tempMin ) {
	    tempMin=temp;
	  }
	  if ( temp > tempMax ){
	    tempMax=temp;
	  }
	}
      }
      /* These define the values you need to translate and scale a
       * point in the plane of the graph to a point in the plane of
       * the canvas so the graph shows at the desired size (the
       * dimensions of the canvas.)  */

      var graphPadding = 30 + 20*(Math.max(log10(tempMin),log10(tempMax)));
      var strokeLength=5;
      var trans = graphContext;
      trans.make(canvas.width,canvas.height,timeMax,timeMin,tempMax,tempMin,graphPadding);

      // Draw the markings on the axis, with value labels
      if (graph.timeMarks == "5minutes"){
	for (var i=timeMax; i > timeMin; i-=300)
	{

	  var realX = trans.getX(i);
	  ctx.moveTo(realX,canvas.height - graphPadding);
	  ctx.lineTo(realX,canvas.height - strokeLength - graphPadding);
	  ctx.stroke();
	  var now = new Date(i*1000)
	  var mostRecentHour=new Date(now.getTime()-( (1000*60*now.getMinutes()) + now.getMilliseconds()));
	  ctx.fillText(mostRecentHour.getHours().toString() + ":" + now.getMinutes().toString() ,realX,canvas.height-(2*graphPadding)/3 );
	}

      } else {
	var now = new Date(timeMax*1000);
	var mostRecentHour=(timeMax*1000)-( (1000*60*now.getMinutes()) + (now.getSeconds()*1000) + now.getMilliseconds());
	for (var i=mostRecentHour; i > (timeMin*1000); i-=(graph.timeMarks*1000))
	{

	  var realX = trans.getX(i/1000);
	  ctx.moveTo(realX,canvas.height - graphPadding);
	  ctx.lineTo(realX,canvas.height - strokeLength - graphPadding);
	  ctx.stroke();
	  var hour = new Date(i)
	  ctx.fillText(hour.getHours() ,realX,canvas.height-(2*graphPadding)/3 );
	}

      }

    }
    for (var i=Math.ceil(tempMin);i<tempMax;i+=graph.tempMarks)
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
    for (var j = 0;j<graph.yVars.length;++j) {

      ctx.strokeStyle=graph.yVars[j].color;
      if (graph.lineWidth) {
	ctx.lineWidth=graph.lineWidth;
      } else {
	ctx.lineWidth= 2.0;
      }

      ctx.fillStyle=graph.yVars[j].color;
      ctx.fillText(graph.yVars[j].name,canvas.width-(110*(j+1)),canvas.height-30);
      ctx.beginPath();
      var show = 12;

      ctx.moveTo(
	graphPadding,
	canvas.height-graphPadding /* bit of a hack, suspect trans has a problem with zero values */
      );
      for (var i = 0;i<graph.xVar.length;i++) {
	ctx.lineTo(
	  trans.getX(parseInt(graph.xVar[i])),
	  trans.getY(parseFloat(graph.yVars[j].data[i]))
	);
      }
      ctx.stroke();
      ctx.closePath();

    }

    ctx.strokeStyle="black";
    // Draw the axes.
    ctx.beginPath()
    ctx.moveTo(graphPadding,canvas.height-graphPadding);
    ctx.lineTo(graphPadding,0);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath()
    ctx.moveTo(graphPadding,canvas.height-graphPadding);
    ctx.lineTo(canvas.width,canvas.height-graphPadding);
    ctx.stroke();
    ctx.closePath();
  }
}
