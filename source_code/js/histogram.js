class Histogram {
    constructor(main_data, genre_data, histogram_div, globalApplicationState){

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
        this.histogram_div = histogram_div
        
        this.histogramSvg = this.histogram_div.append("svg")
            .attr('id', 'histogram_svg')
            .attr('width', this.TOTAL_WIDTH)
            .attr('height', this.TOTAL_HEIGHT)

        
        //**********************************************************************************************
        //                                  GET MIN AND MAX
        //**********************************************************************************************

        // Min and max 

        // this.x_scale = d3.scaleLinear()
        // .domain([this.min, this.max]).nice()
        // .range([this.MARGIN_LEFT, this.WIDTH - this.MARGIN_RIGHT])

        // this.y_scale = d3.scaleLinear()
        // .domain([this.min, this.max]).nice()
        // .range([this.HEIGHT - this.MARGIN_BOTTOM, this.MARGIN_TOP])

        // this.xAxis = g => g
        // .attr("transform", `translate(0,${this.HEIGHT - this.MARGIN_BOTTOM })`)
        // .call(d3.axisBottom(this.x_scale))

        // this.yAxis = g => g
        // .attr("transform", `translate(${this.MARGIN_LEFT},0)`)
        // .call(d3.axisLeft(this.y_scale))


        // this.x_axis = this.alphaSvg.append('g').call(this.xAxis)
        // this.y_axis = this.alphaSvg.append('g').call(this.yAxis)
        // this.points = this.alphaSvg.append('g')

        // //Consider putting the buttonSVG in lineSVG
        // this.buttonsSvg = this.line_div.append("svg")
        //     .attr('id', 'buttons_svg')
        //     .attr('height', this.TOTAL_HEIGHT)
        //     .attr('width', this.TOTAL_WIDTH)
        //     .style('position', 'absolute')

        // this.lineSvg 
        //     .append("g")
        //     .attr("id", "y_axis");
        // this.lineSvg 
        //     .append("g")
        //     .attr("id", "x_axis");

        // this.lineSvg 
        //     .append("g")
        //     .attr("id", "lineChart")
        //     .append("path")
        //     .attr('id', 'line_id')
        //     .style('stroke', 'grey')
        //     .style('stroke-width', this.MAIN_LINE_STROKE_WIDTH)

        // this.linesLeft = document.getElementById("line_svg").getBoundingClientRect().left
        // this.linesRight = document.getElementById("line_svg").getBoundingClientRect().right
    

        //**********************************************************************************************
        //                                  GET MIN AND MAX
        //**********************************************************************************************

        // //min max for source x and y
        // this.max_metric = d3.max(this.genre_data.map(d => d.median_metric))
        // this.min_metric = d3.min(this.genre_data.map(d => d.median_metric))


        // this.max_year = d3.max(this.main_data.map(d => d.year))
        // this.min_year = d3.min(this.main_data.map(d => d.year))
       
        // // //**********************************************************************************************
        // // //                                  SCALES
        // // //**********************************************************************************************

        // //TODO FIX HARD CODING
        // this.scale_metric = d3.scaleLinear()
        //     .range([ this.TOTAL_HEIGHT - this.MARGIN_BOTTOM, 0 + this.MARGIN_TOP]) 
        //     .domain([this.min_metric, this.max_metric]);

        // //TODO scale
        // this.scale_year = d3.scaleLinear()  
        //     .range([0 , this.TOTAL_WIDTH - this.MARGIN_RIGHT ]) 
        //     .domain([this.min_year, this.max_year + 3]);

        // let legend_data = [1940, 1950, 1960, 1970, 1980,1990, 2000, 2010, 2020]
        // let xAxisGenerator = d3.axisBottom(this.scale_year);
    
        // xAxisGenerator.ticks(9);
        // xAxisGenerator.tickValues(['1940', '1950', '1960', '1970', '1980','1990', '2000', '2010', '2020'])
        // xAxisGenerator.tickSize(1)


        //     let xAxis =  d3.select('#x_axis')
        //           .call(xAxisGenerator)
        //           .selectAll("text")
        //           .data(legend_data)
        //           .text((d)=>d)
        //           .attr("color", 'black')
        //           .attr('transform', `translate(${this.PUSH_AXIS_RIGHT}, ${this.TOTAL_HEIGHT - this.PUSH_X_DOWN})`)

               
        //     xAxis
        //     .data(legend_data)
        //     .text((d)=>d)
        //     .style("font", "12px sans-serif")

        //     d3.select('.domain').attr('transform', `translate(${this.PUSH_AXIS_RIGHT}, ${this.TOTAL_HEIGHT - this.PUSH_X_DOWN})`)
        //     d3.select('.ticks').attr('transform', `translate(${this.PUSH_AXIS_RIGHT}, ${this.TOTAL_HEIGHT - this.PUSH_X_DOWN})`)

  
    }

}
