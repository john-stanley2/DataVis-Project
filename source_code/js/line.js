class Line {
    constructor(main_data, genre_data, line_div, globalApplicationState, histogram){

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
        this.GENRE_LINE_STROKE_WIDTH = 3

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
        this.histogram = histogram
        
        this.lineSvg = this.line_div.append("svg")
            .attr('id', 'line_svg')
            .attr('width', this.TOTAL_WIDTH)
            .attr('height', 0)


        //Consider putting the buttonSVG in lineSVG
        /*
        this.buttonsSvg = this.line_div.append("svg")
            .attr('id', 'buttons_svg')
            .attr('height', this.TOTAL_HEIGHT)
            .attr('width', this.TOTAL_WIDTH)
            .style('position', 'absolute')
*/
        this.lineSvg 
            .append("g")
            .attr("id", "y_axis");
        this.lineSvg 
            .append("g")
            .attr("id", "x_axis");

        this.lineSvg 
            .append("g")
            .attr("id", "linelabels")
            .attr('class','labels');

        this.lineSvg 
            .append("g")
            .attr("id", "lineChart")
            .append("path")
            .attr('id', 'line_id')
            .style('stroke', 'grey')
            .style('stroke-width', this.MAIN_LINE_STROKE_WIDTH)

        this.linesLeft = document.getElementById("line_svg").getBoundingClientRect().left
        this.linesRight = document.getElementById("line_svg").getBoundingClientRect().right
    

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

        let legend_data = [1940, 1950, 1960, 1970, 1980,1990, 2000, 2010, 2020]
        let xAxisGenerator = d3.axisBottom(this.scale_year);
    
        xAxisGenerator.ticks(9);
        xAxisGenerator.tickValues(['1940', '1950', '1960', '1970', '1980','1990', '2000', '2010', '2020'])
        xAxisGenerator.tickSize(1)


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

            d3.select('#linelabels')
            .append('text')
            .text('Average uniqueness of song lyrics')
            .attr("transform", "translate(15,330)rotate(270)");
            ;

            d3.select('#linelabels')
            .append('text')
            .text('Year')
            .attr("transform", "translate(450,495)");
            ;
     

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

        const pathLength = lineChart.node().getTotalLength();
        lineChart
            .attr('stroke-dashoffset', pathLength)
            .attr('stroke-dasharray', pathLength)
            .transition().duration(900)
            .attr('stroke-dashoffset', 0);

        let overlay = this.lineSvg
        .append("g")
        .attr('id', 'overlay')
        .append('line')
   
        this.lineSvg.on('mousemove', (event) => {
            // console.log(event.clientX)

            // console.log("this.linesLeft", this.linesLeft)
            // console.log("this.linesRight", this.linesRight)

            if (event.clientX > this.linesLeft + this.PUSH_AXIS_RIGHT && event.clientX <this.linesRight ){
                // console.log("YE")
        
                overlay
                .select('line')
                .attr('stroke', 'black')
                .attr('x1', event.clientX - this.linesLeft)
                .attr('x2', event.clientX -this.linesLeft)
                .attr('y1', this.TOTAL_HEIGHT - this.MARGIN_TOP)
                .attr('y2', 0);

                let year_hovered = this.scale_year.invert(event.clientX - this.linesLeft - this.PUSH_AXIS_RIGHT)//.toISOString().substring(0,10)//FIXME 
                year_hovered = Math.floor(year_hovered)
                this.histogram.draw_year(year_hovered)
                //TODO the hovered year is off by about 4 or 5
                // console.log(year_hovered)



        
        
                // const dateHovered = initial_x_scale.invert(event.clientX - this.linesLeft).toISOString().substring(0,10)//FIXME 
                // const filteredData = locations //this.grouped_continents
                // // .filter()//just get cont
                // .filter((row) => {
                // return new Date(row.date).toISOString().substring(0,10) === dateHovered}) //include logic
                // .sort((rowA, rowB) => {
                // return parseInt(rowB.total_cases_per_million) - parseInt(rowA.total_cases_per_million)})
                
        
                // lineChart.select('#overlay')
                // .selectAll('text')
                // .data(filteredData)
                // .join('text')
                // .text(d=>`${d.location}, ${Math.floor(d.total_cases_per_million / 1000) + "K"}`)
                // .attr('x', event.clientX < 1200 ? event.clientX - this.linesLeft: event.clientX - this.linesLeft- 150)
                // .attr('y', (d, i) => 20*i + 20)
                // .attr('alignment-baseline', 'hanging')
                // .attr('fill', (d) => lineColorScale(d.location));
        
        }
        });


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

    line_animation(line_id) {
        const pathLength = line_id.node().getTotalLength();
        line_id
            .attr('stroke-dashoffset', pathLength)
            .attr('stroke-dasharray', pathLength)
            .transition().ease(d3.easeSin).duration(900)
            .attr('stroke-dashoffset', 0);
    }

    draw_genre_lines(selected_genre){
        let that = this;
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
                if (selected_genre === 'rock'){
                    this.line_animation(rockChart);
                } 
            
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
                if (selected_genre === 'pop'){
                    this.line_animation(popChart);
                } 
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
                if (selected_genre === 'hip hop'){
                    this.line_animation(hipHopChart);
                } 
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
                if (selected_genre === 'jazz'){
                    this.line_animation(jazzChart);
                } 
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
                return(this.globalApplicationState.scaleColor('blues'))
            })
            .style('stroke-width', this.GENRE_LINE_STROKE_WIDTH)

            
            let bluesChart = 
                d3.select("#blues_group")
                .select('#blues_line_id')
                .datum(blues_data)
                .attr('d', this.lineGenerator)
                .attr('opacity',  this.GENRE_LINE_OPACITY)
                .attr('fill', 'none')
                .attr('transform', `translate(${this.PUSH_AXIS_RIGHT}, 0)`);
                if (selected_genre === 'blues'){
                    this.line_animation(bluesChart);
                } 
        }
        else{
            d3
            .select('#blues_group')
            .remove()
        }

        //rnb
        if (this.globalApplicationState.rnb_checked){
            let rnb_data = this.genre_data.filter((d) => d.genre == "r&b")
            this.lineSvg 
            .append("g")
            .attr("id", "rnb_group")
            .append("path")
            .attr('id', 'rnb_line_id')
            .style('stroke', (d) => {
                return(this.globalApplicationState.scaleColor('r&b'))
            })
            .style('stroke-width', this.GENRE_LINE_STROKE_WIDTH)

            let rnbChart = 
                d3.select("#rnb_group")
                .select('#rnb_line_id')
                .datum(rnb_data)
                .attr('d', this.lineGenerator)
                .attr('opacity',  this.GENRE_LINE_OPACITY)
                .attr('fill', 'none')
                .attr('transform', `translate(${this.PUSH_AXIS_RIGHT}, 0)`);
                if (selected_genre === 'rnb'){
                    this.line_animation(rnbChart);
                } 
        }
        else{
            d3
            .select('#rnb_group')
            .remove()
        }

        //country
        if (this.globalApplicationState.country_checked){

            let country_data = this.genre_data.filter((d) => d.genre == "country")
            this.lineSvg 
            .append("g")
            .attr("id", "country_group")
            .append("path")
            .attr('id', 'country_line_id')
            .style('stroke', (d) => {
                return(this.globalApplicationState.scaleColor('country'))
            })
            .style('stroke-width', this.GENRE_LINE_STROKE_WIDTH)

            let countryChart = 
                d3.select("#country_group")
                .select('#country_line_id')
                .datum(country_data)
                .attr('d', this.lineGenerator)
                .attr('opacity',  this.GENRE_LINE_OPACITY)
                .attr('fill', 'none')
                .attr('transform', `translate(${this.PUSH_AXIS_RIGHT}, 0)`);
                if (selected_genre === 'country'){
                    this.line_animation(countryChart);
                } 
        }
        else{
            d3
            .select('#country_group')
            .remove()
        }

        //FOLK
        if (this.globalApplicationState.folk_checked){
            let folk_data = this.genre_data.filter((d) => d.genre == "folk")
            this.lineSvg 
            .append("g")
            .attr("id", "folk_group")
            .append("path")
            .attr('id', 'folk_line_id')
            .style('stroke', (d) => {
                return(this.globalApplicationState.scaleColor('folk'))
            })
            .style('stroke-width', this.GENRE_LINE_STROKE_WIDTH)

            let folkChart = 
                d3.select("#folk_group")
                .select('#folk_line_id')
                .datum(folk_data)
                .attr('d', this.lineGenerator)
                .attr('opacity',  this.GENRE_LINE_OPACITY)
                .attr('fill', 'none')
                .attr('transform', `translate(${this.PUSH_AXIS_RIGHT}, 0)`);
                if (selected_genre === 'folk'){
                    this.line_animation(folkChart);
                } 
        }
        else{
            d3
            .select('#folk_group')
            .remove()
        }


        //easy_listening
        if (this.globalApplicationState.easy_listening_checked){
            let easy_listening_data = this.genre_data.filter((d) => d.genre == "easy listening")
            this.lineSvg 
            .append("g")
            .attr("id", "easy_listening_group")
            .append("path")
            .attr('id', 'easy_listening_line_id')
            .style('stroke', (d) => {
                return(this.globalApplicationState.scaleColor('easy listening'))
            })
            .style('stroke-width', this.GENRE_LINE_STROKE_WIDTH)

            let easy_listeningChart = 
                d3.select("#easy_listening_group")
                .select('#easy_listening_line_id')
                .datum(easy_listening_data)
                .attr('d', this.lineGenerator)
                .attr('opacity',  this.GENRE_LINE_OPACITY)
                .attr('fill', 'none')
                .attr('transform', `translate(${this.PUSH_AXIS_RIGHT}, 0)`);
                if (selected_genre === 'easy listening'){
                    this.line_animation(easy_listeningChart);
                } 
        }
        else{
            d3
            .select('#easy_listening_group')
            .remove()
        }

        //latin
        if (this.globalApplicationState.latin_checked){
            let latin_data = this.genre_data.filter((d) => d.genre == "latin")
            this.lineSvg 
            .append("g")
            .attr("id", "latin_group")
            .append("path")
            .attr('id', 'latin_line_id')
            .style('stroke', (d) => {
                return(this.globalApplicationState.scaleColor('latin'))
            })
            .style('stroke-width', this.GENRE_LINE_STROKE_WIDTH)

            let latinChart = 
                d3.select("#latin_group")
                .select('#latin_line_id')
                .datum(latin_data)
                .attr('d', this.lineGenerator)
                .attr('opacity',  this.GENRE_LINE_OPACITY)
                .attr('fill', 'none')
                .attr('transform', `translate(${this.PUSH_AXIS_RIGHT}, 0)`);
                if (selected_genre === 'latin'){
                    this.line_animation(latinChart);
                } 
        }
        else{
            d3
            .select('#latin_group')
            .remove()
        }

         //metal
         if (this.globalApplicationState.metal_checked){
            let metal_data = this.genre_data.filter((d) => d.genre == "metal")
            this.lineSvg 
            .append("g")
            .attr("id", "metal_group")
            .append("path")
            .attr('id', 'metal_line_id')
            .style('stroke', (d) => {
                return(this.globalApplicationState.scaleColor('metal'))
            })
            .style('stroke-width', this.GENRE_LINE_STROKE_WIDTH)

            let metalChart = 
                d3.select("#metal_group")
                .select('#metal_line_id')
                .datum(metal_data)
                .attr('d', this.lineGenerator)
                .attr('opacity',  this.GENRE_LINE_OPACITY)
                .attr('fill', 'none')
                .attr('transform', `translate(${this.PUSH_AXIS_RIGHT}, 0)`);
                if (selected_genre === 'metal'){
                    this.line_animation(metalChart);
                } 
        }
        else{
            d3
            .select('#metal_group')
            .remove()
        }

        //edm
        if (this.globalApplicationState.edm_checked){
            let edm_data = this.genre_data.filter((d) => d.genre == "edm")
            this.lineSvg 
            .append("g")
            .attr("id", "edm_group")
            .append("path")
            .attr('id', 'edm_line_id')
            .style('stroke', (d) => {
                return(this.globalApplicationState.scaleColor('edm'))
            })
            .style('stroke-width', this.GENRE_LINE_STROKE_WIDTH)

            let edmChart = 
                d3.select("#edm_group")
                .select('#edm_line_id')
                .datum(edm_data)
                .attr('d', this.lineGenerator)
                .attr('opacity',  this.GENRE_LINE_OPACITY)
                .attr('fill', 'none')
                .attr('transform', `translate(${this.PUSH_AXIS_RIGHT}, 0)`);
                if (selected_genre === 'edm'){
                    this.line_animation(edmChart);
                } 
        }
        else{
            d3
            .select('#edm_group')
            .remove()
        }


    }


}