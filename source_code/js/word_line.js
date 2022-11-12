class Word_Line {
    constructor(word_counts,overall_word_counts,line_words_div, globalApplicationState){

        //**********************************************************************************************
        //                                  CONSTANTS FOR CHART SIZE
        //**********************************************************************************************
  
        this.TOTAL_WIDTH = 900;
        this.TOTAL_HEIGHT = 500;
        this.MARGIN_BOTTOM = 50;
        this.MARGIN_TOP = 10;
        this.MARGIN_LEFT = 10;
        this.MARGIN_RIGHT = 50;

        this.PUSH_AXIS_RIGHT = 50;
        this.PUSH_X_DOWN = 40 ;

        this.GENRE_LINE_OPACITY = .9;
        this.GENRE_LINE_STROKE_WIDTH = 2;

        this.MAIN_LINE_OPACITY = .25;
        this.MAIN_LINE_STROKE_WIDTH = 1.5;
       
        this.ANIMATION_DURATION = 8;


        //**********************************************************************************************
        //                                  GENERAL SET UP 
        //**********************************************************************************************
        this.globalApplicationState = globalApplicationState;
        this.word_counts = word_counts;
        this.overall_word_counts = overall_word_counts;
        this.line_div = line_words_div;
        
        this.lineSvg = this.line_div.append("svg")
            .attr('id', 'line_words_svg')
            .attr('width', this.TOTAL_WIDTH)
            .attr('height', this.TOTAL_HEIGHT)
        ;
        //Consider putting the buttonSVG in lineSVG
        // this.buttonsSvg = this.line_div.append("svg")
        //     .attr('id', 'buttons_svg')
        //     .attr('height', this.TOTAL_HEIGHT)
        //     .attr('width', this.TOTAL_WIDTH)
        //     .style('position', 'absolute')
        // ;
        this.lineSvg 
            .append("g")
            .attr("id", "word_y_axis");
        this.lineSvg 
            .append("g")
            .attr("id", "word_x_axis");

        this.lineSvg 
            .append("g")
            .attr("id", "word_lineChart")
            .append("path")
            .attr('id', 'word_line_id')
            .style('stroke', 'grey')
            .style('stroke-width', this.MAIN_LINE_STROKE_WIDTH);

        //**********************************************************************************************
        //                                  GET MIN AND MAX
        //**********************************************************************************************


        this.max_year = d3.max(this.word_counts.map(d => d.year));
        this.min_year = d3.min(this.word_counts.map(d => d.year));
       
        // //**********************************************************************************************
        // //                                  SCALES
        // //**********************************************************************************************
        //TODO scale
        this.scale_year = d3.scaleLinear()  
            .range([0 , this.TOTAL_WIDTH - this.MARGIN_RIGHT ]) 
            .domain([this.min_year, this.max_year + 3]);


        let legend_data = ['1940', '1950', '1960', '1970', '1980','1990', '2000', '2010', '2020']
        let xAxisGenerator = d3.axisBottom(this.scale_year);
    
        xAxisGenerator.ticks(9);
        xAxisGenerator.tickValues(['1940', '1950', '1960', '1970', '1980','1990', '2000', '2010', '2020']);
        xAxisGenerator.tickSize(0);


            let xAxis =  d3.select('#word_x_axis')////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                  .call(xAxisGenerator)
                  .selectAll("text")
                  .data(legend_data)
                  .text((d)=>d)
                  .attr("color", 'black')
                  .attr('transform', `translate(${this.PUSH_AXIS_RIGHT}, ${this.TOTAL_HEIGHT - this.PUSH_X_DOWN})`)
            ;
               
            xAxis
            .data(legend_data)
            .text((d)=>d)
            .style("font", "12px sans-serif")
            ;

            d3.select('#word_x_axis').select('.domain').attr('transform', `translate(${this.PUSH_AXIS_RIGHT}, ${this.TOTAL_HEIGHT - this.PUSH_X_DOWN})`);
            d3.select('#word_x_axis').select('.ticks').attr('transform', `translate(${this.PUSH_AXIS_RIGHT}, ${this.TOTAL_HEIGHT - this.PUSH_X_DOWN})`);

        
    }



    draw_main_line(){
        // //min max for source x and y
        this.max_metric = d3.max(this.overall_word_counts.map(d => d.dance_norm))
        this.min_metric = 0;//d3.min(this.genre_data.map(d => d.median_metric))

        //TODO FIX HARD CODING
        this.scale_metric = d3.scaleLinear()
        .range([ this.TOTAL_HEIGHT - this.MARGIN_BOTTOM, 0 + this.MARGIN_TOP]) 
        .domain([0, this.max_metric]);

        //FIXME!!! I'm hard coding this stuff. Got to make it better
        d3.select('#word_y_axis')
        .attr('transform', `translate(${this.PUSH_AXIS_RIGHT},${this.MARGIN_TOP})`)
        .call(d3.axisLeft(this.scale_metric));
    

        //**********************************************************************************************
        //                                      ADD MAIN LINE
        //**********************************************************************************************


        this.lineGenerator = d3
            .line()
            .x((data) => this.scale_year (data.year))
            .y((data) => this.scale_metric (data.dance_norm));

        //FIXME HARDOCODING
        let lineChart = 
            d3.select("#word_lineChart")
            .select('#word_line_id')
            .datum(this.word_counts)
            .attr('d', this.lineGenerator)
            .attr('stroke', (d) => {
                return('grey')
            })
            .attr('opacity', this.MAIN_LINE_OPACITY)
            .attr('fill', 'none')
            .attr('transform', `translate(${this.PUSH_AXIS_RIGHT}, ${0})`);
    }



    draw_genre_lines(){

        //**********************************************************************************************
        //                                      ADD Genre Lines
        //**********************************************************************************************


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


    }


}
