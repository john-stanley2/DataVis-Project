class Line{
    constructor(main_data, genre_data, line_div, globalApplicationState){

        //**********************************************************************************************
        //                                  CONSTANTS FOR CHART SIZE
        //**********************************************************************************************
  
        this.TOTAL_WIDTH = 900
        this.TOTAL_HEIGHT = 500
        this.MARGIN_BOTTOM = 50
        this.MARGIN_TOP = 10
        this.MARGIN_LEFT = 10
        this.MARGIN_RIGHT = 50

        this.PUSH_AXIS_RIGHT = 50
        this.PUSH_X_DOWN = 40 

        this.GENRE_LINE_OPACITY = .9
        this.GENRE_LINE_STROKE_WIDTH = 2

        this.MAIN_LINE_OPACITY = .25
        this.MAIN_LINE_STROKE_WIDTH = 1.5
       
        this.ANIMATION_DURATION = 8


        //**********************************************************************************************
        //                                  GENERAL SET UP 
        //**********************************************************************************************
        this.globalApplicationState = globalApplicationState
        this.main_data = main_data
        this.genre_data = genre_data
        this.line_div = line_div
        
        this.lineSvg = this.line_div.append("svg")
            .attr('id', 'line_svg')
            .attr('width', this.TOTAL_WIDTH)
            .attr('height', this.TOTAL_HEIGHT)

        //Consider putting the buttonSVG in lineSVG
        this.buttonsSvg = this.line_div.append("svg")
            .attr('id', 'buttons_svg')
            .attr('height', this.TOTAL_HEIGHT)
            .attr('width', this.TOTAL_WIDTH)
            .style('position', 'absolute')

        this.lineSvg 
            .append("g")
            .attr("id", "y_axis");
        this.lineSvg 
            .append("g")
            .attr("id", "x_axis");

        this.lineSvg 
            .append("g")
            .attr("id", "lineChart")
            .append("path")
            .attr('id', 'line_id')
            .style('stroke', 'grey')
            .style('stroke-width', this.MAIN_LINE_STROKE_WIDTH)


        //**********************************************************************************************
        //                                  GET MIN AND MAX
        //**********************************************************************************************

        // //min max for source x and y
        this.max_metric = d3.max(this.genre_data.map(d => d.median_metric))
        this.min_metric = d3.min(this.genre_data.map(d => d.median_metric))


        this.max_year = d3.max(this.main_data.map(d => d.year))
        this.min_year = d3.min(this.main_data.map(d => d.year))
       
        // //**********************************************************************************************
        // //                                  SCALES
        // //**********************************************************************************************

        //TODO FIX HARD CODING
        this.scale_metric = d3.scaleLinear()
            .range([ this.TOTAL_HEIGHT - this.MARGIN_BOTTOM, 0 + this.MARGIN_TOP]) 
            .domain([this.min_metric, this.max_metric]);

        //TODO scale
        this.scale_year = d3.scaleLinear()  
            .range([0 , this.TOTAL_WIDTH - this.MARGIN_RIGHT ]) 
            .domain([this.min_year, this.max_year + 3]);

        let legend_data = ['1940', '1950', '1960', '1970', '1980','1990', '2000', '2010', '2020']
        let xAxisGenerator = d3.axisBottom(this.scale_year);
    
        xAxisGenerator.ticks(9);
        xAxisGenerator.tickValues(['1940', '1950', '1960', '1970', '1980','1990', '2000', '2010', '2020'])
        xAxisGenerator.tickSize(0)


            let xAxis =  d3.select('#x_axis')
                  .call(xAxisGenerator)
                  .selectAll("text")
                  .data(legend_data)
                  .text((d)=>d)
                  .attr("color", 'black')
                  .attr('transform', `translate(${this.PUSH_AXIS_RIGHT}, ${this.TOTAL_HEIGHT - this.PUSH_X_DOWN})`)

               
            xAxis
            .data(legend_data)
            .text((d)=>d)
            .style("font", "12px sans-serif")

            d3.select('.domain').attr('transform', `translate(${this.PUSH_AXIS_RIGHT}, ${this.TOTAL_HEIGHT - this.PUSH_X_DOWN})`)
            d3.select('.ticks').attr('transform', `translate(${this.PUSH_AXIS_RIGHT}, ${this.TOTAL_HEIGHT - this.PUSH_X_DOWN})`)


     

        //**********************************************************************************************
        //                                      LEGEND
        //**********************************************************************************************

        

        // let xAxisGenerator = d3.axisBottom(this.scale_margin);

        //FIXME!!! I'm hard coding this stuff. Got to make it better
        d3.select('#y_axis')
            .attr('transform', `translate(${this.PUSH_AXIS_RIGHT},${this.MARGIN_TOP})`)
            .call(d3.axisLeft(this.scale_metric));
        // d3.select('#x_axis')
        //     .call(d3.axisBottom(this.scale_year))
        //     .attr('transform', `translate(${this.PUSH_AXIS_RIGHT}, ${this.TOTAL_HEIGHT - 40})`);

        

        //**********************************************************************************************
        //                                      ADD MAIN LINE
        //**********************************************************************************************



        this.lineGenerator = d3
            .line()
            .x((data) => this.scale_year (data.year))
            .y((data) => this.scale_metric (data.median_metric));

        //FIXME HARDOCODING
        let lineChart = 
            d3.select("#lineChart")
            .select('#line_id')
            .datum(this.main_data)
            .attr('d', this.lineGenerator)
            .attr('stroke', (d) => {
                return('grey')
            })
            .attr('opacity', this.MAIN_LINE_OPACITY)
            .attr('fill', 'none')
            .attr('transform', `translate(${this.PUSH_AXIS_RIGHT}, ${0})`);

   



        // //**********************************************************************************************
        // //                                      TEXT
        // //**********************************************************************************************

        


        // let text = this.bubbleSvg
        //     .append('g')
        //     .attr('id', "text_g")
        
        // text.append("text")
        //     .attr("text-anchor", "middle")
        //     .attr("transform",
        //     "translate(0," + this.LABELS_MARGIN + ")")
        //     .attr("x", 75)
        //     .attr('y', 10)
        //     .text("Democratic Leaning")
        //     .style("font", "16px sans-serif")
        //     .style("font-weight", "bold")
        //     .attr('fill', "steelblue")

        // text.append("text")
        //     .attr("text-anchor", "middle")
        //     .attr("transform",
        //     "translate(0," + this.LABELS_MARGIN + ")")
        //     .attr("x", this.TOTAL_WIDTH - 85)
        //     .attr('y', 10)
        //     .text("Republican Leaning")
        //     .style("font", "16px sans-serif")
        //     .style("font-weight", "bold")
        //     .attr('fill', "firebrick")

       
      
        // //**********************************************************************************************
        // //                                      DRAW BUBBLES FOR FIRST TIME
        // //**********************************************************************************************

        // var tooltip = d3.select("#bubble_div")
        //     .append("div")
        //     .style("opacity", 0)
        //     .style('position', 'absolute')
        //     .attr("id", 'tool_tip_div')
        //     .attr("class", "tooltip")
        //     .style("background-color", "black")
        //     .style("border-radius", "5px")
        //     // .style("padding", "10px")
        //     .style("color", "white")

        //     // var div = d3.select("body").append("div")	
        //     // .attr("class", "tooltip")				
        //     // .style("opacity", 0);
            
        // this.single_g = this.bubbleSvg
        // // this.single_g = tooltip
        //     .append('g')
        //     .attr("id", 'single_g')
        //     .attr("transform",
        //     "translate(0," + this.BUBBLE_MARGIN + ")")

        // this.single_g.append("line")
        //     .attr("y1", this.CENTER_LINE_TOP)
        //     .attr("y2", this.max_y + this.CENTER_LINE_BOTTOM )
        //     .attr("x1", this.scale_percent(0))
        //     .attr("x2", this.scale_percent(0))
        //     .attr( "stroke", "grey" )
        //     .attr( "stroke-width", "2" )
        //     .attr( "stroke-opacity", '.5')

        
        // //**********************************************************************************************
        // //                                     TOOL TIP
        // //**********************************************************************************************


        // const that = this
        // this.single_g
        //     .selectAll('circle')
        //     .data(this.data)
        //     .join('circle')
        //     .attr("cx", (d) => d.sourceX)
        //     .attr('cy', (d) => d.sourceY)
        //     .style("stroke", "black")
        //     .style("fill", (d) => this.scaleColor(d.category))
        //     .attr("r", (d) => this.scaleCircle(d.total))
        //     .on("mouseover", function(event, d) { 
               

        //         tooltip
        //         .transition()
        //         .duration(200)

        //         tooltip
        //         .style("opacity", 1)
        //         .html("Phrase: " +d.phrase + " <br>Percent of speeches: " + (d.total / 50))
        //         .style("left", (event.pageX + 30+ "px"))
        //         .style("top", ((event.pageY - 30) + "px"))
        //     })
        //     .on("mousemove", function(event, d) {
        //         tooltip
        //         .style("left", (event.pageX + 30 + "px"))
        //         .style("top", ((event.pageY - 30) + "px"))
        //      })
        //     .on("mouseleave", function(event, d) {
        //         tooltip
        //         .transition()
        //         .duration(200)
        //         .style("opacity", 0)
        //     })




        // //**********************************************************************************************
        // //                                     BRUSH
        // //**********************************************************************************************

        

        // this.brushSvg.selectAll('g')
        // .data(this.keys)
        // .join('g')
        // .attr('transform', (d,i) => 'translate(0,' + (this.BUBBLE_START + ((i) * this.GROUPED_WIDTH)) + ')')
        // .attr('class', 'oned-brushes')
        // .append('rect')
        // .attr('height', this.GROUPED_WIDTH)
        // .attr('width', this.TOTAL_WIDTH)
        // .attr('fill', 'none')
        // .attr('stroke', 'none')

        // this.brushGroups = this.brushSvg.selectAll('g')
        // this.updateBrush()
       
    }

    draw_genre_lines(){

        //ROCK
        if (this.globalApplicationState.rock_checked){
            let rock_data = this.genre_data.filter((d) => d.genre == "rock")

            this.lineSvg 
            .append("g")
            .attr("id", "rock_group")
            .append("path")
            .attr('id', 'rock_line_id')
            .style('stroke', (d) => {
                return(this.globalApplicationState.scaleColor('rock'))
            })
            .style('stroke-width', this.GENRE_LINE_STROKE_WIDTH)

            
            let rockChart = 
                d3.select("#rock_group")
                .select('#rock_line_id')
                .datum(rock_data)
                .attr('d', this.lineGenerator)
                .attr('opacity',  this.GENRE_LINE_OPACITY)
                .attr('fill', 'none')
                .attr('transform', `translate(${this.PUSH_AXIS_RIGHT}, 0)`);
        }

        else{
            d3
            .select('#rock_group')
            .remove()
        }

        //POP
        if (this.globalApplicationState.pop_checked){
            let pop_data = this.genre_data.filter((d) => d.genre == "pop")

            this.lineSvg 
            .append("g")
            .attr("id", "pop_group")
            .append("path")
            .attr('id', 'pop_line_id')
            .style('stroke', (d) => {
                return(this.globalApplicationState.scaleColor('pop'))
            })
            .style('stroke-width', this.GENRE_LINE_STROKE_WIDTH)

            
            let popChart = 
                d3.select("#pop_group")
                .select('#pop_line_id')
                .datum(pop_data)
                .attr('d', this.lineGenerator)
                .attr('opacity',  this.GENRE_LINE_OPACITY)
                .attr('fill', 'none')
                .attr('transform', `translate(${this.PUSH_AXIS_RIGHT}, 0)`);
        }

        else{
            d3
            .select('#pop_group')
            .remove()
        }

        //Hip Hop
        if (this.globalApplicationState.hip_hop_checked){
            let hip_hop_data = this.genre_data.filter((d) => d.genre == "hip hop")

            this.lineSvg 
            .append("g")
            .attr("id", "hip_hop_group")
            .append("path")
            .attr('id', 'hip_hop_line_id')
            .style('stroke', (d) => {
                return(this.globalApplicationState.scaleColor('hip hop'))
            })
            .style('stroke-width', this.GENRE_LINE_STROKE_WIDTH)

            
            let hipHopChart = 
                d3.select("#hip_hop_group")
                .select('#hip_hop_line_id')
                .datum(hip_hop_data)
                .attr('d', this.lineGenerator)
                .attr('opacity',  this.GENRE_LINE_OPACITY)
                .attr('fill', 'none')
                .attr('transform', `translate(${this.PUSH_AXIS_RIGHT}, 0)`);
        }
        else{
            d3
            .select('#hip_hop_group')
            .remove()
        }

        //JAZZ
        if (this.globalApplicationState.jazz_checked){
            let jazz_data = this.genre_data.filter((d) => d.genre == "jazz")
            this.lineSvg 
            .append("g")
            .attr("id", "jazz_group")
            .append("path")
            .attr('id', 'jazz_line_id')
            .style('stroke', (d) => {
                return(this.globalApplicationState.scaleColor('jazz'))
            })
            .style('stroke-width', this.GENRE_LINE_STROKE_WIDTH)

            
            let jazzChart = 
                d3.select("#jazz_group")
                .select('#jazz_line_id')
                .datum(jazz_data)
                .attr('d', this.lineGenerator)
                .attr('opacity',  this.GENRE_LINE_OPACITY)
                .attr('fill', 'none')
                .attr('transform', `translate(${this.PUSH_AXIS_RIGHT}, 0)`);
        }
        else{
            d3
            .select('#jazz_group')
            .remove()
        }

        //BLUES
        if (this.globalApplicationState.blues_checked){
            let blues_data = this.genre_data.filter((d) => d.genre == "blues")
            this.lineSvg 
            .append("g")
            .attr("id", "blues_group")
            .append("path")
            .attr('id', 'blues_line_id')
            .style('stroke', (d) => {
                return(this.globalApplicationState.scaleColor('jazz'))
            })
            .style('stroke-width', this.GENRE_LINE_STROKE_WIDTH)

            
            let jazzChart = 
                d3.select("#blues_group")
                .select('#blues_line_id')
                .datum(blues_data)
                .attr('d', this.lineGenerator)
                .attr('opacity',  this.GENRE_LINE_OPACITY)
                .attr('fill', 'none')
                .attr('transform', `translate(${this.PUSH_AXIS_RIGHT}, 0)`);
        }
        else{
            d3
            .select('#blues_group')
            .remove()
        }


    }


}