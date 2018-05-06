//draw a bar chart with d3js
//External data source is average crime rates in US urban areas
var bardata = [];
var barlabel= [];

d3.csv('avg_crime_us.csv', function(d){
	for (key in d){
		bardata.push(d[key].average);
		barlabel.push(d[key].city);
	}

//create a margin key/value object
var margin = {top:30, right:30, bottom:120, left:80};


//define the height, width, barwidth and baroffset
var height = 750 - margin.top - margin.bottom,
	width = 1200 - margin.left - margin.right,
	barWidth = 10,
	barOffset = 5;

//get the length of data
var r = bardata.length;	
	
var colors = d3.scale.linear()
//define a domain of colors
	.domain([0, r])
	.range(['#c61c6f','#1358c6']);

var yScale = d3.scale.linear()
	.domain([0, 2500])
	.range([0, height]);

var xScale = d3.scale.ordinal()
	.domain(d3.range(0, bardata.length))
	.rangeBands([0, width], 0.1);

var tempColor;
//creating tooltip variable
var tooltip = d3.select('body').append('div')
	.style('position','absolute')
	.style('padding', '0px 10px')
	.style('background', '#ffffff')
	.style('opacity', 0)//we don't want to show initially


//define the chrt
var myChart = d3.select('#chart').append('svg')
	.attr('width', width + margin.left + margin.right)
	.attr('height', height + margin.top + margin.bottom)
	.append('g')
	.attr('transform','translate('+ margin.left +', '+ margin.top +')')
	.selectAll().data(bardata)
	.enter().append('rect')
	.style('fill', function(d,i){
		return colors(i);
	})
	.attr('width',xScale.rangeBand())
	.attr('height', 0)//this was changed from function to 0
	.attr('x', function(d,i){
		return xScale(i);
	})
	.attr('y', height)//this was changed from function to height	

	
//adding events to the #chart
.on('mouseover', function(d, i) {
	//adding tooltip
	tooltip.transition() //add the data to the tooltip
	.style('left', (d3.event.pageX-35)+'px')
	.style('top', (d3.event.pageY-40)+'px')
	.style('opacity', .9)
	tooltip.html(barlabel[i]+','+ bardata[i])//adding two tooltips 
	
	
	tempColor = this.style.fill;
	d3.select(this) //select the current selection
		//.transition removed
	.style('opacity', .5)
	.style('fill','green')
})

.on('mouseout', function(d) {
	d3.select(this)
	//.transition removed
	.style('opacity', 1)
	.style('fill', tempColor)
})



myChart.transition() //assigning transition to the entire
//chart
.attr('height', function(d){
	return yScale(d);
})
.attr('y', function(d){
	return height - yScale(d);
})
.delay(function(d, i){
	return i*25
})
.duration(1000)
.ease('bounce')//make it bouncy

//for some reason the d3.max didn't give me correct results, so I used the absolute number for domain max
var vGuideScale = d3.scale.linear()
.domain([0,2500])
.range([height,0])

//create a vertical axis using svg.axis() method
var xAxis = d3.svg.axis()
.scale(vGuideScale)//try yScale first
.orient('left')
.ticks(10)

//create a guide and add the axis to it
var vGuide = d3.select('svg').append('g');

xAxis(vGuide);//call vAxis and pass it to the guide

//move the guide 35px from left and 0px from the top
vGuide.attr('transform', 'translate('+ margin.left +', '+ margin.top +')')


//style the guide so it is visible
vGuide.selectAll('path')
.style({fill:'none', stroke:'#000'})

//style the tick (line elements) so they show
vGuide.selectAll('line')
	.style({stroke:'#000'})

//creating the horizontal axis
var hAxis = d3.svg.axis()
	.scale(xScale)
	.orient('bottom')
	.tickFormat(function (d, i){return barlabel[i]})
	
	 //tickFormat loop through the labels and add them to the axis
						
//create the group element, add hGuide, and show (style) it
var hGuide = d3.select('svg').append('g')

hAxis(hGuide)
hGuide.attr('transform','translate('+ margin.left +','+ (height+margin.top) +')')
	.selectAll('text')  
            .attr('transform', 'rotate(-90)')
			.attr('x', -10)
			.attr('y', -5)
			.style('text-anchor', 'end')
			.style('font-size', '10px');
			
			
hGuide.selectAll('path')
	.style({fill:'none', stroke:'#000'})
hGuide.selectAll('line')
	.style({stroke: '#000'})

//define the title for the chart
var title = d3.select('svg').append('text')
	.attr('x', (width/2))
	.attr('y', (margin.top))
	.attr('text-anchor', 'middle')  
    .style('font-size', '20px') 
    .style('text-decoration', 'bold')  
    .text('Average Crime rate per captia in US Urban areas 1975 - 2015')

//define the label for y axis
var yLabel = d3.select('svg').append('text')
	.attr('x', -270)
	.attr('y', ((margin.left/2)-8))
	.attr('text-anchor', 'middle')  
    .style('font-size', '12px') 
	.attr('transform', 'rotate(270)')
    .style('text-decoration', 'bold')  
    .text('Average Crime rate/captia')

//define the label for x axis
var xLabel = d3.select('svg').append('text')
	.attr('x', (width/2)+10)
	.attr('y', (height+140))
	.attr('text-anchor', 'middle')  
    .style('font-size', '12px') 
    .style('text-decoration', 'bold')  
    .text('Cities/Counties')



});//closing d3.csv()

