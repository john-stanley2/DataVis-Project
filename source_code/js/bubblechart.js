class BubbleChart {
    constructor(overall_data, year_data, line_div, globalApplicationState){
        
        //**********************************************************************************************
        //                                  CONSTANTS FOR CHART SIZE
        //**********************************************************************************************
  
        this.TOTAL_WIDTH = 900
        this.TOTAL_HEIGHT = 900
        this.MARGIN_BOTTOM = 50
        this.MARGIN_TOP = 10
        this.MARGIN_LEFT = 100
        this.MARGIN_RIGHT = 30

        this.PUSH_AXIS_RIGHT = 50
        this.PUSH_X_DOWN = 40 

        this.GENRE_LINE_OPACITY = .9
        this.GENRE_LINE_STROKE_WIDTH = 2

        this.MAIN_LINE_OPACITY = .25
        this.MAIN_LINE_STROKE_WIDTH = 1.5
       
        this.ANIMATION_DURATION = 8

        //**********************************************************************************************
        //                                  
        //**********************************************************************************************

        this.globalApplicationState = globalApplicationState;
        //this.overall_data = overall_data;
        //let overall_data_filtered = this.overall_data.filter(d => d.freq > 10);
        this.overall_data = overall_data.filter(d => d.freq_norm > .05);//////////////////////
        this.year_data = year_data;

        this.line_div = line_div;
        
        this.lineSvg = this.line_div.append("svg")
            .attr('id', 'bubblechart_svg')
            .attr('width', this.TOTAL_WIDTH)
            .attr('height', this.TOTAL_HEIGHT)
        ;

        let svg = this.lineSvg;

        svg
        .append('text')
        .text('Most Common Words by Genre')
        .attr('x', this.MARGIN_LEFT)
        .attr('y', 20);

        svg
        .append('g')
        .attr('id','x-axis')
        ;

        svg
        .append('g')
        .attr('id','genre-text')
        ;

        svg
        .append('g')
        .attr('id','circles')
        ;
        
    }

    drawXaxis(scaleX){
        let svg = this.lineSvg.select('#x-axis');

        svg
        .join('g')
        .transition().duration((d,i) => 900)
        .call(d3.axisBottom(scaleX))
        .attr('transform', `translate(0, ${80})`)
        ;
    }


    renderCircles(overall_data_genre) {
        let selection = d3.select('#circles').selectAll('circle')
        .data(overall_data_genre)
        .join('circle')
        .transition().duration((d,i) => i * 3+180)
        .attr('cx', d => {
            return d.x
        })
        .attr('cy', function(d) {
            return d.y
        })
        .attr('fill',d => this.globalApplicationState.scaleColor(d.genre))
        .attr("r", 4)
        .attr('fill-opacity',1)
        //.attr('stroke','black')
        //.attr('stroke-opacity',.1)
        ;
      }

    drawCircles (expanded=0) {

        let allGenres =  ["pop", 'rock', 'hip_hop', 'latin', 'edm', 'rnb', 
        'country', 'folk',  'metal', 'jazz', 'easy_listening', 'new_age', 'blues', 'world'];
        let checkedGenres = {};
        let i = 1;

        for (let genre of allGenres){
            if (this.globalApplicationState[genre + "_checked"] && !(genre in checkedGenres)){
                checkedGenres[genre] = i;
                i++;
            }
        }

        let overall_data_genre = this.overall_data.filter(d => d.genre in checkedGenres);

        d3.select('#bubblechart_svg')
        .attr('height', Object.keys(checkedGenres).length * this.TOTAL_HEIGHT/10 + 200);

        //////////////////////Gather new information for xScale//////////////////////////////////

        let freq_min = d3.min(overall_data_genre, function (d) {
            return d.freq_norm});

        let freq_max = d3.max(overall_data_genre, function (d) {
            return d.freq_norm});

        let scaleX = d3.scaleLinear()
        .domain([0, freq_max])//Math.ceil(freq_max/100) * 100])
        .range([this.MARGIN_LEFT, this.TOTAL_WIDTH - this.MARGIN_RIGHT]);

        if (!expanded){
            /*
          selection = d3.select('#circles').selectAll('circle')
            .data(this.overall_data)
            .join('circle');
          selection
            .transition().duration((d,i) => i * 3+180)
            .attr("cx", d => {if (d.freq > 400){console.log(d)};return d.freq + this.MARGIN_LEFT})
            .attr("cy",this.TOTAL_HEIGHT/2)//d => d.sourceY+MARGIN.top+120)
            .attr('fill',d => this.globalApplicationState.scaleColor(d.genre))
            .attr("r", 10)
            .attr('opacity',1)
            ;
            */

            d3.forceSimulation(overall_data_genre)
            .force("x", d3.forceX().x(d => scaleX(d.freq_norm)))
            .force("y", d3.forceY().y(d => {
                /*
                if (d.freq > 200){
                    console.log(d)
                }
                */
                if (d.genre in checkedGenres){
                    return this.MARGIN_TOP + 50 + this.TOTAL_HEIGHT/10 * checkedGenres[d.genre]
                    //return this.TOTAL_HEIGHT/2
                }else{
                    return -50
                }
            })
            )
            .force('collision', d3.forceCollide().radius(4.1))
            .tick(300)
            .on('tick',this.renderCircles(overall_data_genre))
            ;

            d3.select('#genre-text').selectAll('text')
            .data(Object.keys(checkedGenres))
            .join('text')
            .transition().duration((d,i) => i * 3+180)
            .text(d => d)
            .attr('y',d => (this.MARGIN_TOP + 50 + this.TOTAL_HEIGHT/10 * checkedGenres[d]))
            .attr('x',10)
            ;

            this.drawXaxis(scaleX);
            //this.renderCircles(overall_data_genre);

            

            


        }/*else{

          selection = d3.select('#circles').selectAll('circle')
            .data(this.globalApplicationState.loadData)
            .join('circle');
          selection
            .transition().duration((d,i) => i * 3+180)
            .attr("cx", d => d.moveX + MARGIN.left)
            .attr("cy",d => d.moveY+MARGIN.top+120)
            .attr('fill',d => this.globalApplicationState.scaleColor(d.category))
            .attr("r", d => this.scaleSize(d.total))
            .attr('opacity',1)
            ;
        }
    
        this.globalApplicationState.c_selection = selection;*/
        this.tooltip();
        
        }


    tooltip() {
        let that = this;
        d3.select('#circles').selectAll('circle').on("mouseover", function(event,info){
    
        let selected = d3.select(this)
            .style('stroke-width', 2.5)
            .style('stroke','black')
            .style('stroke-opacity',.8)
            .data()
            ;
    
        let sourceX_ = selected[0].x;
        let sourceY_ = selected[0].y;
        let word_ = selected[0].word;
        let freq_ = selected[0].freq;
    
        let text_selection = d3.select('#bubblechart_svg')
            .append('g')
            .attr('class','tooltip_info')
            .attr("transform", function() {
            let x = null;
            let y = sourceY_ + 10;
            if ((sourceX_ < 650))
            {x = sourceX_ + 20}
            else{x = sourceX_-250}
            return "translate("+ x.toString()+ "," + y.toString() + ")";})
            ;
    
        text_selection
            .append('rect')
            .attr('width',230)
            .attr('height',100)
            .attr('x',0)
            .attr('y',0)
            .attr('fill','white')
            .attr('fill-opacity',.8)
            .attr('stroke','black')
            .attr('stroke-opacity',.8)
            .attr('class','tooltip_rect')
            ;

        
        text_selection
            .append('text')
            .text(
                word_
            )
            .attr('x', 10)
            .attr('y', 25)
            .attr("font-weight",600)
            .style('font-size','20px')
            ;

        text_selection
            .append('text')
            .text(
                freq_
            )
            .attr('x', 10)
            .attr('y', 45)
            .attr("font-weight",600)
            .style('font-size','20px')
            ;
        })
        .on('mouseout',function(){
            d3.select(this)
            .style('stroke-opacity',0);
    
    
            d3.selectAll('.tooltip_info').remove();
        });
    }


}