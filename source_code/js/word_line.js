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
        this.word_counts = word_counts.filter((d) => !((d.genre === 'new age') || (d.genre === 'world') || (d.genre === 'classical')));
        this.overall_word_counts = overall_word_counts;
        this.line_div = line_words_div;
        
        this.lineSvg = this.line_div.append("svg")
            .attr('id', 'line_words_svg')
            .attr('width', this.TOTAL_WIDTH)
            .attr('height', 0)
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

        this.lineSvg 
            .append("g")
            .attr("id", "wordlinelabels")
            .attr('class','labels');

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

            d3.select('#word_x_axis').select('.domain').attr('transform', `translate(${this.PUSH_AXIS_RIGHT}, ${this.TOTAL_HEIGHT - this.MARGIN_BOTTOM})`);
            d3.select('#word_x_axis').select('.ticks').attr('transform', `translate(${this.PUSH_AXIS_RIGHT}, ${this.TOTAL_HEIGHT - this.PUSH_X_DOWN})`);


            d3.select('#wordlinelabels')
            .append('text')
            .text('Counts per Song')
            .attr("transform", "translate(15,280)rotate(270)");
            ;

            d3.select('#wordlinelabels')
            .append('text')
            .text('Year')
            .attr("transform", "translate(450,495)");
            ;

        
    }

    get_xScale(){
        let min_metric = 0;//d3.min(this.genre_data.map(d => d.median_metric))
        let max_metric = 0;

        if (this.globalApplicationState.love_checked){
            max_metric = d3.max(this.word_counts.map(d => d.love_norm))
        }
        if (this.globalApplicationState.dance_checked){
            max_metric = d3.max(this.word_counts.map(d => d.dance_norm))
        }
        if (this.globalApplicationState.cool_checked){
            max_metric = d3.max(this.word_counts.map(d => d.cool_norm))
        }
        if (this.globalApplicationState.god_checked){
            max_metric = d3.max(this.word_counts.map(d => d.god_norm))
        }
        if (this.globalApplicationState.rock_w_checked){
            max_metric = d3.max(this.word_counts.map(d => d.rock_norm))
        }
        if (this.globalApplicationState.swear_checked){
            max_metric = d3.max(this.word_counts.map(d => d.swear_norm))
        }

        //TODO FIX HARD CODING
        let scale_metric = d3.scaleLinear()
        .range([ this.TOTAL_HEIGHT - this.MARGIN_BOTTOM, 0 + this.MARGIN_TOP]) 
        .domain([0, Math.ceil(max_metric)]);

        return scale_metric
    }



    draw_main_line() {

        let scale_metric = this.get_xScale();

        //FIXME!!! I'm hard coding this stuff. Got to make it better
        d3.select('#word_y_axis')
        .attr('transform', `translate(${this.PUSH_AXIS_RIGHT},${0})`)
        .transition().ease(d3.easeSin).duration(900)
        .call(d3.axisLeft(scale_metric));
    

        //**********************************************************************************************
        //                                      ADD MAIN LINE
        //**********************************************************************************************


        const lineGenerator = d3
            .line()
            .x((data) => this.scale_year (data.year))
            .y((data) => {
                let word_value = 0;
                if (this.globalApplicationState.love_checked){
                    word_value = data.love_norm
                }
                if (this.globalApplicationState.dance_checked){
                    word_value = data.dance_norm
                }
                if (this.globalApplicationState.cool_checked){
                    word_value = data.cool_norm
                }
                if (this.globalApplicationState.god_checked){
                    word_value = data.god_norm
                }
                if (this.globalApplicationState.rock_w_checked){
                    word_value = data.rock_norm
                }
                if (this.globalApplicationState.swear_checked){
                    word_value = data.swear_norm
                }
                return scale_metric(word_value)});


        //FIXME HARDOCODING
        let lineChart = 
            d3.select("#word_lineChart")
            .select('#word_line_id')
            .datum(this.overall_word_counts)
            .attr('d', (d) => {
                return lineGenerator(d)}
            )
            .attr('stroke', (d) => {
                return('grey')
            })
            .attr('opacity', this.MAIN_LINE_OPACITY)
            .attr('fill', 'none')
            .attr('transform', `translate(${this.PUSH_AXIS_RIGHT}, ${0})`);
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
        
        let scale_metric = this.get_xScale();

        const lineGenerator = d3
            .line()
            .x((data) => this.scale_year (data.year))
            .y((data) => {
                let word_value = null;
                if (this.globalApplicationState.love_checked){
                    word_value = data.love_norm
                }
                else if (this.globalApplicationState.dance_checked){
                    word_value = data.dance_norm
                }
                else if (this.globalApplicationState.cool_checked){
                    word_value = data.cool_norm
                }
                else if (this.globalApplicationState.god_checked){
                    word_value = data.god_norm
                }
                else if (this.globalApplicationState.rock_w_checked){
                    word_value = data.rock_norm
                }
                else if (this.globalApplicationState.swear_checked){
                    word_value = data.swear_norm
                }
                return scale_metric(word_value)})
            ;


        //**********************************************************************************************
        //                                      ADD Genre Lines
        //**********************************************************************************************
        d3.selectAll('.line_group').remove();

        //ROCK
        if (this.globalApplicationState.rock_checked){
            let wc_filtered = JSON.parse(JSON.stringify(this.word_counts));
            let rock_data = wc_filtered.filter((d) => d.genre === "rock");

            this.lineSvg 
            .append("g")
            .attr('class','line_group')
            .attr("id", "wc_rock_group")
            .append("path")
            .attr('id', 'wc_rock_line_id')
            .style('stroke', (d) => {
                return(this.globalApplicationState.scaleColor('rock'))
            })
            .style('stroke-width', this.GENRE_LINE_STROKE_WIDTH)

            
            let rockChart = 
                d3.select("#wc_rock_group")
                .select('#wc_rock_line_id')
                .datum(rock_data)
                .attr('d', lineGenerator)
                .attr('opacity',  this.GENRE_LINE_OPACITY)
                .attr('fill', 'none')
                .attr('transform', `translate(${this.PUSH_AXIS_RIGHT}, 0)`);

                if (selected_genre === 'rock'){
                    this.line_animation(rockChart);
                } 
        }
        else{
            d3
            .select('#wc_rock_group')
            .remove()
        }

        //Pop
        if (this.globalApplicationState.pop_checked){
            let wc_filtered = JSON.parse(JSON.stringify(this.word_counts));
            let pop_data = wc_filtered.filter((d) => d.genre === "pop");
            this.lineSvg 
            .append("g")
            .attr('class','line_group')
            .attr("id", "wc_pop_group")
            .append("path")
            .attr('id', 'wc_pop_line_id')
            .style('stroke', (d) => {
                return(this.globalApplicationState.scaleColor('pop'))
            })
            .style('stroke-width', this.GENRE_LINE_STROKE_WIDTH)

            
            let popChart = 
                d3.select("#wc_pop_group")
                .select('#wc_pop_line_id')
                .datum(pop_data)
                .attr('d', lineGenerator)
                .attr('opacity',  this.GENRE_LINE_OPACITY)
                .attr('fill', 'none')
                .attr('transform', `translate(${this.PUSH_AXIS_RIGHT}, 0)`);

                if (selected_genre === 'pop'){
                    this.line_animation(popChart);
                } 
        }

        else{
            d3
            .select('#wc_pop_group')
            .remove()
        }

        //Hip Hop
        if (this.globalApplicationState.hip_hop_checked){
            let wc_filtered = JSON.parse(JSON.stringify(this.word_counts));
            let hip_hop_data = wc_filtered.filter((d) => d.genre === "hip hop");
            this.lineSvg 
            .append("g")
            .attr('class','line_group')
            .attr("id", "wc_hip_hop_group")
            .append("path")
            .attr('id', 'wc_hip_hop_line_id')
            .style('stroke', (d) => {
                return(this.globalApplicationState.scaleColor('hip hop'))
            })
            .style('stroke-width', this.GENRE_LINE_STROKE_WIDTH)

            
            let hip_hopChart = 
                d3.select("#wc_hip_hop_group")
                .select('#wc_hip_hop_line_id')
                .datum(hip_hop_data)
                .attr('d', lineGenerator)
                .attr('opacity',  this.GENRE_LINE_OPACITY)
                .attr('fill', 'none')
                .attr('transform', `translate(${this.PUSH_AXIS_RIGHT}, 0)`);

                if (selected_genre === 'hip hop'){
                    this.line_animation(hip_hopChart);
                } 
        }

        else{
            d3
            .select('#wc_hip_hop_group')
            .remove()
        }

        //Latin
        if (this.globalApplicationState.latin_checked){
            let wc_filtered = JSON.parse(JSON.stringify(this.word_counts));
            let latin_data = wc_filtered.filter((d) => d.genre === "latin");
            this.lineSvg 
            .append("g")
            .attr('class','line_group')
            .attr("id", "wc_latin_group")
            .append("path")
            .attr('id', 'wc_latin_line_id')
            .style('stroke', (d) => {
                return(this.globalApplicationState.scaleColor('latin'))
            })
            .style('stroke-width', this.GENRE_LINE_STROKE_WIDTH)

            
            let latinChart = 
                d3.select("#wc_latin_group")
                .select('#wc_latin_line_id')
                .datum(latin_data)
                .attr('d', lineGenerator)
                .attr('opacity',  this.GENRE_LINE_OPACITY)
                .attr('fill', 'none')
                .attr('transform', `translate(${this.PUSH_AXIS_RIGHT}, 0)`);

                if (selected_genre === 'latin'){
                    this.line_animation(latinChart);
                } 
        }

        else{
            d3
            .select('#wc_latin_group')
            .remove()
        }


        //edm
        if (this.globalApplicationState.edm_checked){
            let wc_filtered = JSON.parse(JSON.stringify(this.word_counts));
            let edm_data = wc_filtered.filter((d) => d.genre === "edm");
            this.lineSvg 
            .append("g")
            .attr('class','line_group')
            .attr("id", "wc_edm_group")
            .append("path")
            .attr('id', 'wc_edm_line_id')
            .style('stroke', (d) => {
                return(this.globalApplicationState.scaleColor('edm'))
            })
            .style('stroke-width', this.GENRE_LINE_STROKE_WIDTH)

            
            let edmChart = 
                d3.select("#wc_edm_group")
                .select('#wc_edm_line_id')
                .datum(edm_data)
                .attr('d', lineGenerator)
                .attr('opacity',  this.GENRE_LINE_OPACITY)
                .attr('fill', 'none')
                .attr('transform', `translate(${this.PUSH_AXIS_RIGHT}, 0)`);

                if (selected_genre === 'edm'){
                    this.line_animation(edmChart);
                } 
        }

        else{
            d3
            .select('#wc_edm_group')
            .remove()
        }

        //rnb
        if (this.globalApplicationState.rnb_checked){
            let wc_filtered = JSON.parse(JSON.stringify(this.word_counts));
            let rnb_data = wc_filtered.filter((d) => d.genre === "r&b");
            this.lineSvg 
            .append("g")
            .attr('class','line_group')
            .attr("id", "wc_rnb_group")
            .append("path")
            .attr('id', 'wc_rnb_line_id')
            .style('stroke', (d) => {
                return(this.globalApplicationState.scaleColor('r&b'))
            })
            .style('stroke-width', this.GENRE_LINE_STROKE_WIDTH)

            
            let rnbChart = 
                d3.select("#wc_rnb_group")
                .select('#wc_rnb_line_id')
                .datum(rnb_data)
                .attr('d', lineGenerator)
                .attr('opacity',  this.GENRE_LINE_OPACITY)
                .attr('fill', 'none')
                .attr('transform', `translate(${this.PUSH_AXIS_RIGHT}, 0)`);

                if (selected_genre === 'rnb'){
                    this.line_animation(rnbChart);
                } 
        }

        else{
            d3
            .select('#wc_rnb_group')
            .remove()
        }


        //Country
        if (this.globalApplicationState.country_checked){
            let wc_filtered = JSON.parse(JSON.stringify(this.word_counts));
            let country_data = wc_filtered.filter((d) => d.genre === "country");
            this.lineSvg 
            .append("g")
            .attr('class','line_group')
            .attr("id", "wc_country_group")
            .append("path")
            .attr('id', 'wc_country_line_id')
            .style('stroke', (d) => {
                return(this.globalApplicationState.scaleColor('country'))
            })
            .style('stroke-width', this.GENRE_LINE_STROKE_WIDTH)

            
            let countryChart = 
                d3.select("#wc_country_group")
                .select('#wc_country_line_id')
                .datum(country_data)
                .attr('d', lineGenerator)
                .attr('opacity',  this.GENRE_LINE_OPACITY)
                .attr('fill', 'none')
                .attr('transform', `translate(${this.PUSH_AXIS_RIGHT}, 0)`);
                if (selected_genre === 'country'){
                    this.line_animation(countryChart);
                } 
        }

        else{
            d3
            .select('#wc_country_group')
            .remove()
        }

        //Folk
        if (this.globalApplicationState.folk_checked){
            let wc_filtered = JSON.parse(JSON.stringify(this.word_counts));
            let folk_data = wc_filtered.filter((d) => d.genre === "folk");
            this.lineSvg 
            .append("g")
            .attr('class','line_group')
            .attr("id", "wc_folk_group")
            .append("path")
            .attr('id', 'wc_folk_line_id')
            .style('stroke', (d) => {
                return(this.globalApplicationState.scaleColor('folk'))
            })
            .style('stroke-width', this.GENRE_LINE_STROKE_WIDTH)

            
            let folkChart = 
                d3.select("#wc_folk_group")
                .select('#wc_folk_line_id')
                .datum(folk_data)
                .attr('d', lineGenerator)
                .attr('opacity',  this.GENRE_LINE_OPACITY)
                .attr('fill', 'none')
                .attr('transform', `translate(${this.PUSH_AXIS_RIGHT}, 0)`);
                if (selected_genre === 'folk'){
                    this.line_animation(folkChart);
                } 
        }

        else{
            d3
            .select('#wc_folk_group')
            .remove()
        }

        //Metal
        if (this.globalApplicationState.metal_checked){
            let wc_filtered = JSON.parse(JSON.stringify(this.word_counts));
            let metal_data = wc_filtered.filter((d) => d.genre === "metal");
            this.lineSvg 
            .append("g")
            .attr('class','line_group')
            .attr("id", "wc_metal_group")
            .append("path")
            .attr('id', 'wc_metal_line_id')
            .style('stroke', (d) => {
                return(this.globalApplicationState.scaleColor('metal'))
            })
            .style('stroke-width', this.GENRE_LINE_STROKE_WIDTH)

            
            let metalChart = 
                d3.select("#wc_metal_group")
                .select('#wc_metal_line_id')
                .datum(metal_data)
                .attr('d', lineGenerator)
                .attr('opacity',  this.GENRE_LINE_OPACITY)
                .attr('fill', 'none')
                .attr('transform', `translate(${this.PUSH_AXIS_RIGHT}, 0)`);
                if (selected_genre === 'metal'){
                    this.line_animation(metalChart);
                } 
        }

        else{
            d3
            .select('#wc_metal_group')
            .remove()
        }

        //Jazz
        if (this.globalApplicationState.jazz_checked){
            let wc_filtered = JSON.parse(JSON.stringify(this.word_counts));
            let jazz_data = wc_filtered.filter((d) => d.genre === "jazz");
            this.lineSvg 
            .append("g")
            .attr('class','line_group')
            .attr("id", "wc_jazz_group")
            .append("path")
            .attr('id', 'wc_jazz_line_id')
            .style('stroke', (d) => {
                return(this.globalApplicationState.scaleColor('jazz'))
            })
            .style('stroke-width', this.GENRE_LINE_STROKE_WIDTH)

            
            let jazzChart = 
                d3.select("#wc_jazz_group")
                .select('#wc_jazz_line_id')
                .datum(jazz_data)
                .attr('d', lineGenerator)
                .attr('opacity',  this.GENRE_LINE_OPACITY)
                .attr('fill', 'none')
                .attr('transform', `translate(${this.PUSH_AXIS_RIGHT}, 0)`);
                if (selected_genre === 'jazz'){
                    this.line_animation(jazzChart);
                } 
        }

        else{
            d3
            .select('#wc_jazz_group')
            .remove()
        }




        //Easy Listening
        if (this.globalApplicationState.easy_listening_checked){
            let wc_filtered = JSON.parse(JSON.stringify(this.word_counts));
            let easy_listening_data = wc_filtered.filter((d) => d.genre === "easy listening");
            this.lineSvg 
            .append("g")
            .attr('class','line_group')
            .attr("id", "wc_easy_listening_group")
            .append("path")
            .attr('id', 'wc_easy_listening_line_id')
            .style('stroke', (d) => {
                return(this.globalApplicationState.scaleColor('easy_listening'))
            })
            .style('stroke-width', this.GENRE_LINE_STROKE_WIDTH)

            
            let easy_listeningChart = 
                d3.select("#wc_easy_listening_group")
                .select('#wc_easy_listening_line_id')
                .datum(easy_listening_data)
                .attr('d', lineGenerator)
                .attr('opacity',  this.GENRE_LINE_OPACITY)
                .attr('fill', 'none')
                .attr('transform', `translate(${this.PUSH_AXIS_RIGHT}, 0)`);

                if (selected_genre === 'easy listening'){
                    this.line_animation(easy_listeningChart);
                } 
        }

        else{
            d3
            .select('#wc_easy_listening_group')
            .remove()
        }


        //Blues
        if (this.globalApplicationState.blues_checked){
            let wc_filtered = JSON.parse(JSON.stringify(this.word_counts));
            let blues_data = wc_filtered.filter((d) => d.genre === "blues");
            this.lineSvg 
            .append("g")
            .attr('class','line_group')
            .attr("id", "wc_blues_group")
            .append("path")
            .attr('id', 'wc_blues_line_id')
            .style('stroke', (d) => {
                return(this.globalApplicationState.scaleColor('blues'))
            })
            .style('stroke-width', this.GENRE_LINE_STROKE_WIDTH)

            
            let bluesChart = 
                d3.select("#wc_blues_group")
                .select('#wc_blues_line_id')
                .datum(blues_data)
                .attr('d', lineGenerator)
                .attr('opacity',  this.GENRE_LINE_OPACITY)
                .attr('fill', 'none')
                .attr('transform', `translate(${this.PUSH_AXIS_RIGHT}, 0)`);

                if (selected_genre === 'blues'){
                    this.line_animation(bluesChart);
                } 
        }

        else{
            d3
            .select('#wc_blues_group')
            .remove()
        }
        

    }


}
