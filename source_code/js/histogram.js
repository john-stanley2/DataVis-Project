class Histogram {
    constructor(main_data, histogram_data, histogram_div, globalApplicationState){

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

        this.selected_year = 0


        //**********************************************************************************************
        //                                  GENERAL SET UP
        //**********************************************************************************************
        this.globalApplicationState = globalApplicationState
        this.main_data = main_data
        this.histogram_data = histogram_data
        this.histogram_div = histogram_div
        
        this.histogramSvg = this.histogram_div.append("svg")
            .attr('id', 'histogram_svg')
            .attr('width', this.TOTAL_WIDTH)
            .attr('height', 0)

        
        //**********************************************************************************************
        //                                  GET MIN AND MAX
        //**********************************************************************************************

        // Min and max 

        this.x_scale = d3.scaleLinear()
        .domain([0, 1]).nice()
        .range([this.MARGIN_LEFT, this.TOTAL_WIDTH - this.MARGIN_RIGHT])

        this.y_scale = d3.scaleLinear()
        .domain([0, 40]).nice()
        .range([this.TOTAL_HEIGHT - this.MARGIN_BOTTOM, this.MARGIN_TOP])

        this.xAxis = g => g
        .attr("transform", `translate(${this.PUSH_AXIS_RIGHT},${this.TOTAL_HEIGHT - this.MARGIN_BOTTOM })`)
        .call(d3.axisBottom(this.x_scale))

        this.yAxis = g => g
        .attr("transform", `translate(${this.MARGIN_LEFT + this.PUSH_AXIS_RIGHT},0)`)
        .call(d3.axisLeft(this.y_scale))

        this.histogramSvg
            .append("g")
            .attr("id", "histlabels")
            .attr('class','labels');

        this.histogramSvg
            .append("g")
            .append('text')
            .attr("id", "histyear")
            ;


        this.x_axis = this.histogramSvg.append('g').call(this.xAxis)
        this.y_axis = this.histogramSvg.append('g').call(this.yAxis)
        this.bars = this.histogramSvg.append('g')


        d3.select('#histlabels')
            .append('text')
            .text('Number of Songs')
            .attr("transform", "translate(30,300)rotate(270)");
            ;

            d3.select('#histlabels')
            .append('text')
            .text('Uniqueness of song lyrics')
            .attr("transform", "translate(450,490)");
            ;

  
    }

    get_selected_year(){
        return this.selected_year
    }

    get_checked(){
        let clicked_genres = []
        if (this.globalApplicationState.rock_checked) {clicked_genres.push('rock')}
        if (this.globalApplicationState.pop_checked) {clicked_genres.push('pop')}
        if (this.globalApplicationState.hip_hop_checked) {clicked_genres.push('hip hop')}
        if (this.globalApplicationState.latin_checked) {clicked_genres.push('latin')}
        if (this.globalApplicationState.rnb_checked) {clicked_genres.push('r&b')}
        if (this.globalApplicationState.edm_checked) {clicked_genres.push('edm')}
        if (this.globalApplicationState.country_checked) {clicked_genres.push('country')}
        if (this.globalApplicationState.folk_checked) {clicked_genres.push('folk')}
        if (this.globalApplicationState.metal_checked) {clicked_genres.push('metal')}
        if (this.globalApplicationState.jazz_checked) {clicked_genres.push('jazz')}
        if (this.globalApplicationState.easy_listening_checked) {clicked_genres.push('easy listening')}
        if (this.globalApplicationState.blues_checked) {clicked_genres.push('blues')}

    
        return clicked_genres
      
    }

    draw_year(year_hovered){
        this.selected_year = year_hovered

        d3.select('#histyear')
            //.join('text')
            .text(this.selected_year)
            .attr('x',700)
            .attr('y',100)
            .attr("font-weight",600)
            .style('font-size','50px')
            ;

        if (this.selected_year != 0){

            let year_data = this.histogram_data.filter(d => (d.year == this.selected_year))
            let clicked_genres = this.get_checked()
            let final_data = []

            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
            }

            for (let i = 0; i < year_data.map(d=>d.metric).filter(onlyUnique).length; i ++){

                let cur_metric = year_data.map(d=>d.metric).filter(onlyUnique)[i]
                let cur_row = {}
                cur_row["metric"] = cur_metric
                cur_row["other"] = 0
                for (let k = 0; k < year_data.length; k ++){
                    if (year_data[k].metric === cur_metric){
                        if (clicked_genres.includes(year_data[k].genre)){ // clicked_genres[j] === year_data[k].genre)
                            cur_row[year_data[k].genre] = year_data[k].n  //   cur_row[clicked_genres[j]] = year_data[k].n 

                        }
                        else{
                            // cur_row[year_data[k].genre] = 0 //cur_row[clicked_genres[j]] = 0
                            cur_row["other"] += year_data[k].n
                        }
                }
                }
                final_data.push(cur_row)
            }

        let bars = ['other']
        for (let i = 0; i < clicked_genres.length; i++){
            bars.push(clicked_genres[i])
        }

        //Code taken an modified from https://d3-graph-gallery.com/graph/barplot_stacked_basicWide.html

        var stackedData = d3.stack()
        .keys(bars)
        (final_data)

        // console.log(stackedData)

        const that = this
        this.bars
        .selectAll("g")
        // Enter in the stack data = loop key per key = group per group
        .data(stackedData)
        .join("g")
        .selectAll("rect")
        .data(function(d) {
            // console.log("this d", d)
            return d.map(e => ({key: d.key, ...e}) ) }) //d.map(d => );
        .join("rect")
            .attr("fill", function(d) {
                // console.log("here", d)
                if (d.key === 'other'){
                    return 'grey'
                }
                return that.globalApplicationState.scaleColor(d.key); })
            .attr("x", function(d) {
                return that.x_scale(d.data.metric) + that.PUSH_AXIS_RIGHT; })
            .attr("y", function(d) { 
                return that.y_scale(d[1]); })
            .attr("height", function(d) { return that.y_scale(d[0]) - that.y_scale(d[1]); })
            .attr("width",7)
            .style("animation", 8)

        }
            
    }

}
