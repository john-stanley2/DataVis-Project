
var LINE_WIDTH = 900;
var POP_WORDS_WIDTH = 900;

let wrapper = d3.select("body")
    .append('div')
    .attr('id', 'wrapper_div')
;
let head_div = wrapper.append('div')
        .attr("id", 'head_div')
;

wrapper.append('div')
    .attr('class','center')
    .attr('class','vis_title')
    .style('height','50px')
    .attr('id','view1_title')
    .append('text')
    .text('Has music become more repetitive?')
    //.attr('transform', `translate(0, 500)`)
    
    
    //.style('text-align','center')
    ;

let view1 = wrapper.append('div')
            .attr('class','center')
            .style('width','1800px')
;

let lineDiv = view1.append('g')
                .attr("id", 'line_div')
                //.style('width', '900px')
                //.style('float', 'left')
;

let histogramDiv = view1.append('g')
                .attr("id", 'histogram_div')
                .style('width', '900px')
                //.style('float', 'right')
;

wrapper.append('div')
    .attr('class','center')
    .attr('class','vis_title')
    .style('height','50px')
    .attr('id','view2_title')
    .append('text')
    .text('What are the most common lyrics in each genre?')
    ;

let popWordsDiv = wrapper.append('div')
                .attr("id", 'pop_words_div')
                 .attr('class','center')
                .style('width', '1500px')
;

wrapper.append('div')
    .attr('class','center')
    .attr('class','vis_title')
    .style('height','50px')
    .attr('id','view3_title')
    .append('text')
    .text('Has the lingo changed?')
    ;


let view3 = wrapper.append('div')
        .attr('class','center')
        .style('width','1200px')
;

dropdown_box = view3.append('div')
            .attr("id", 'alpha-div')
            .style('display','none')
            .style('vertical-align','top')
            ;
dropdown_box.append('select')
    .attr('id','select-stimulated')
;

let lineWordsDiv = view3.append('g')
                .attr("id", 'line_words_div')
                .attr('class','center')
                .style('width','900px')
;



let allGenres =  ["pop", 'rock', 'hip hop', 'latin', 'edm', 'r&b', 
'country', 'folk',  'metal', 'jazz', 'easy listening', 'blues']
;

// scaleColor = d3.scaleOrdinal() 
//         .domain(allGenres)
//         .range(["#11C67A", "#FFC60D" , "#076CFD", "#FDB9CB", "#F87D1F", "#EA3636"]);

let scaleColor = d3.scaleOrdinal() 
        .domain(allGenres)
        .range(["#47694f", //pop
        "#fa7900" , //rock
        "#d1463f",  //hip hop
        "#e317dc",  //latin
        "#03fc2c",  //edm
        "#e3d734",     //r&b
        "#99895c",  //country
        "#0d6b45",  //folk
        "#02000a", //metal
        "#411cc7", //jazz
        "#1c91c7", //el
        "#003efa", //blues
    ]);
const globalApplicationState = {
    rock_checked: false,
    pop_checked: false,
    hip_hop_checked: false,
    latin_checked: false,
    edm_checked: false,
    rnb_checked: false,
    country_checked: false,
    folk_checked: false,
    metal_checked: false,
    jazz_checked: false,
    easy_listening_checked: false,
    blues_checked: false,
    scaleColor,
    love_checked: true,
    dance_checked: false,
    cool_checked: false,
    god_checked: false,
    rock_w_checked: false,
    swear_checked: false,
    year_hovered: null, //For the histogram
    view1_expanded: 0,
    view2_expanded: 0,
    view3_expanded: 0
  };

        

//for the first view
main_line_data = d3.json("./vis_data/main_line.json");
genre_lines_data = d3.json('./vis_data/genre_lines.json');
word_freq_data = d3.json('./vis_data/word_freq.json');
overall_word_freq_data = d3.json('./vis_data/word_freq_year.json');
hist_data = d3.json("./vis_data/hist.json");

overall_cw_data = d3.json('./vis_data/overall_common_word.json');
yearly_cw_data = d3.json('./vis_data/yearly_common_word.json');

Promise.all([main_line_data,genre_lines_data,word_freq_data,overall_word_freq_data,hist_data, overall_cw_data, yearly_cw_data]).then( data =>
    {
        //data[0] = main_line_data
        //data[1] = genre_line_data
        console.log("main line", data[0]);
        console.log("genre line", data[1]);
        console.log("word frequency", data[2]);
        console.log("overall word frequency", data[3]);
        console.log("hist data", data[4]);


        histogram = new Histogram(data[0], data[4],histogramDiv ,globalApplicationState)
        line = new Line(data[0], data[1],lineDiv ,globalApplicationState, histogram);
        word_line = new Word_Line(data[2],data[3],lineWordsDiv,globalApplicationState);
        word_line.draw_main_line();
        bubblechart = new BubbleChart(data[5],data[6],popWordsDiv,globalApplicationState);
        bubblechart.drawCircles();

    });

//############################  MAKE BUTTONS AND ADD LISTENERS  ############################//

let button_svg = d3.select('#buttons-div')
    .attr('class','center')
    .style('width','1335px')
    .append('svg')
    .attr('id', 'all_buttons')
    .attr('width', 1335)
    .attr('height', 200)
    ;

//ROCK

let rock_button = button_svg.append('g')
    .attr('id','rock_box')
    .attr('transform', `translate(30, ${30})`)

rock_button
    .append('rect')
    .attr('id','rock_rect')
    .attr('fill', scaleColor('rock'))
    .attr('width',200)
    .attr('height',50)
    .attr('stroke','black')
    .style('stroke-width', 3)
    .style('stroke-opacity',.5)
    .attr('fill-opacity',1)
;

rock_button
    .append('text')
    .text('Rock')
    .attr('transform', `translate(20, ${33})`)
;

 //Add listeners to check box

 d3.select('#rock_rect').on("mouseover", function(event,info){
    d3.select('#rock_rect')
        .style('cursor','pointer')
        .attr('fill-opacity',.85)
 }).on('mouseout',function(){
    d3.select('#rock_rect')
    .style('cursor','default')
    .attr('fill-opacity',1)
    ;
 });

 d3.select('#rock_box').on('click', function(event,info) 
 {        
     if (globalApplicationState.rock_checked){
         globalApplicationState.rock_checked = false;
         d3.select('#rock_rect')
         .style('stroke-width', 2)
         .style('stroke-opacity',.5)
         ;
        
        ;
     }
     else{
         globalApplicationState.rock_checked = true;
         d3.select('#rock_rect')
         .style('stroke-width', 4)
         .style('stroke-opacity',.9)
        ;
     }
     histogram.draw_year(histogram.get_selected_year());
     line.draw_genre_lines('rock');
     word_line.draw_genre_lines();
     bubblechart.drawCircles();
 });

 //POP

 let pop_button = button_svg.append('g')
 .attr('id','pop_box')
 .attr('transform', `translate(250, ${30})`)

pop_button
 .append('rect')
 .attr('id','pop_rect')
 .attr('fill', scaleColor('pop'))
 .attr('width',200)
 .attr('height',50)
 .attr('stroke','black')
 .style('stroke-width', 3)
 .style('stroke-opacity',.5)
 .attr('fill-opacity',1)
;

pop_button
 .append('text')
 .text('Pop')
 .attr('transform', `translate(20, ${33})`)
;

//Add listeners to check box

d3.select('#pop_rect').on("mouseover", function(event,info){
 d3.select('#pop_rect')
     .style('cursor','pointer')
     .attr('fill-opacity',.85)
}).on('mouseout',function(){
 d3.select('#pop_rect')
 .style('cursor','default')
 .attr('fill-opacity',1)
 ;
});


 d3.select('#pop_box').on('click', (d) => 
 {        
     if (globalApplicationState.pop_checked){
         globalApplicationState.pop_checked = false;
         d3.select('#pop_rect')
         .style('stroke-width', 2)
         .style('stroke-opacity',.5)
         ;
     }
     else{
         globalApplicationState.pop_checked = true;
         d3.select('#pop_rect')
         .style('stroke-width', 4)
         .style('stroke-opacity',.9)
        ;
     }
     histogram.draw_year(histogram.get_selected_year());
     line.draw_genre_lines('pop');
     word_line.draw_genre_lines();
     bubblechart.drawCircles();
 });

 //HIP HOP

 let hip_hop_button = button_svg.append('g')
 .attr('id','hip_hop_box')
 .attr('transform', `translate(470, ${30})`)

 hip_hop_button
 .append('rect')
 .attr('id','hip_hop_rect')
 .attr('fill', scaleColor('hip hop'))
 .attr('width',200)
 .attr('height',50)
 .attr('stroke','black')
 .style('stroke-width', 3)
 .style('stroke-opacity',.5)
 .attr('fill-opacity',1)
;

hip_hop_button
 .append('text')
 .text('Hip Hop')
 .attr('transform', `translate(20, ${33})`)
;

//Add listeners to check box

d3.select('#hip_hop_rect').on("mouseover", function(event,info){
 d3.select('#hip_hop_rect')
     .style('cursor','pointer')
     .attr('fill-opacity',.85)
}).on('mouseout',function(){
 d3.select('#hip_hop_rect')
 .style('cursor','default')
 .attr('fill-opacity',1)
 ;
});


 d3.select('#hip_hop_box').on('click', (d) => 
 {        
     if (globalApplicationState.hip_hop_checked){
         globalApplicationState.hip_hop_checked = false;
         d3.select('#hip_hop_rect')
         .style('stroke-width', 2)
         .style('stroke-opacity',.5)
         ;
     }
     else{
         globalApplicationState.hip_hop_checked = true;
         d3.select('#hip_hop_rect')
         .style('stroke-width', 4)
         .style('stroke-opacity',.9)
        ;
     }
     histogram.draw_year(histogram.get_selected_year());
     line.draw_genre_lines('hip hop')
     word_line.draw_genre_lines();
     bubblechart.drawCircles();
 });


 //JAZZ

 let jazz_button = button_svg.append('g')
 .attr('id','jazz_box')
 .attr('transform', `translate(690, ${30})`)

 jazz_button
 .append('rect')
 .attr('id','jazz_rect')
 .attr('fill', scaleColor('jazz'))
 .attr('width',200)
 .attr('height',50)
 .attr('stroke','black')
 .style('stroke-width', 3)
 .style('stroke-opacity',.5)
 .attr('fill-opacity',1)
;

jazz_button
 .append('text')
 .text('Jazz')
 .attr('transform', `translate(20, ${33})`)
;

//Add listeners to check box

d3.select('#jazz_rect').on("mouseover", function(event,info){
 d3.select('#jazz_rect')
     .style('cursor','pointer')
     .attr('fill-opacity',.85)
}).on('mouseout',function(){
 d3.select('#jazz_rect')
 .style('cursor','default')
 .attr('fill-opacity',1)
 ;
});

 d3.select('#jazz_box').on('click', (d) => 
 {        
     if (globalApplicationState.jazz_checked){
         globalApplicationState.jazz_checked = false;
         d3.select('#jazz_rect')
         .style('stroke-width', 2)
         .style('stroke-opacity',.5)
         ;
     }
     else{
         globalApplicationState.jazz_checked = true;
         d3.select('#jazz_rect')
         .style('stroke-width', 4)
         .style('stroke-opacity',.9)
        ;
     }
     histogram.draw_year(histogram.get_selected_year());
     line.draw_genre_lines('jazz');
     word_line.draw_genre_lines();
     bubblechart.drawCircles();
 });

 //BLUES

 let blues_button = button_svg.append('g')
 .attr('id','blues_box')
 .attr('transform', `translate(910, ${30})`)

 blues_button
 .append('rect')
 .attr('id','blues_rect')
 .attr('fill', scaleColor('blues'))
 .attr('width',200)
 .attr('height',50)
 .attr('stroke','black')
 .style('stroke-width', 3)
 .style('stroke-opacity',.5)
 .attr('fill-opacity',1)
;

blues_button
 .append('text')
 .text('Blues')
 .attr('transform', `translate(20, ${33})`)
;

//Add listeners to check box

d3.select('#blues_rect').on("mouseover", function(event,info){
 d3.select('#blues_rect')
     .style('cursor','pointer')
     .attr('fill-opacity',.85)
}).on('mouseout',function(){
 d3.select('#blues_rect')
 .style('cursor','default')
 .attr('fill-opacity',1)
 ;
});

 d3.select('#blues_box').on('click', (d) => 
 {        
     if (globalApplicationState.blues_checked){
         globalApplicationState.blues_checked = false;
         d3.select('#blues_rect')
         .style('stroke-width', 2)
         .style('stroke-opacity',.5)
         ;
     }
     else{
         globalApplicationState.blues_checked = true;
         d3.select('#blues_rect')
         .style('stroke-width', 4)
         .style('stroke-opacity',.9)
        ;
     }
     histogram.draw_year(histogram.get_selected_year());
     line.draw_genre_lines('blues')
     word_line.draw_genre_lines();
     bubblechart.drawCircles();
 });

  //R&B

  let r_b_box_button = button_svg.append('g')
  .attr('id','r_b_box')
  .attr('transform', `translate(1130, ${30})`)
 
  r_b_box_button
  .append('rect')
  .attr('id','r_b_box_rect')
  .attr('fill', scaleColor('r&b'))
  .attr('width',200)
  .attr('height',50)
  .attr('stroke','black')
  .style('stroke-width', 3)
  .style('stroke-opacity',.5)
  .attr('fill-opacity',1)
 ;
 
 r_b_box_button
  .append('text')
  .text('R&B')
  .attr('transform', `translate(20, ${33})`)
 ;
 
 //Add listeners to check box
 
 d3.select('#r_b_box_rect').on("mouseover", function(event,info){
  d3.select('#r_b_box_rect')
      .style('cursor','pointer')
      .attr('fill-opacity',.65)
 }).on('mouseout',function(){
  d3.select('#r_b_box_rect')
  .style('cursor','default')
  .attr('fill-opacity',1)
  ;
 });

  d3.select('#r_b_box').on('click', (d) => 
  {        
      if (globalApplicationState.rnb_checked){
          globalApplicationState.rnb_checked = false;
          d3.select('#r_b_box_rect')
         .style('stroke-width', 2)
         .style('stroke-opacity',.5)
         ;
      }
      else{
          globalApplicationState.rnb_checked = true;
          d3.select('#r_b_box_rect')
         .style('stroke-width', 4)
         .style('stroke-opacity',.9)
        ;
      }
      histogram.draw_year(histogram.get_selected_year());
      line.draw_genre_lines('rnb')
      word_line.draw_genre_lines();
      bubblechart.drawCircles();
  });

  //country


  let country_button = button_svg.append('g')
 .attr('id','country_box')
 .attr('transform', `translate(30, ${100})`)

 country_button
 .append('rect')
 .attr('id','country_rect')
 .attr('fill', scaleColor('country'))
 .attr('width',200)
 .attr('height',50)
 .attr('stroke','black')
 .style('stroke-width', 3)
 .style('stroke-opacity',.5)
 .attr('fill-opacity',1)
;

country_button
 .append('text')
 .text('Country')
 .attr('transform', `translate(20, ${33})`)
;

//Add listeners to check box

d3.select('#country_rect').on("mouseover", function(event,info){
 d3.select('#country_rect')
     .style('cursor','pointer')
     .attr('fill-opacity',.85)
}).on('mouseout',function(){
 d3.select('#country_rect')
 .style('cursor','default')
 .attr('fill-opacity',1)
 ;
});

  d3.select('#country_box').on('click', (d) => 
  {        

      if (globalApplicationState.country_checked){
          globalApplicationState.country_checked = false;
          d3.select('#country_rect')
         .style('stroke-width', 2)
         .style('stroke-opacity',.5)
         ;
      }
      else{
          globalApplicationState.country_checked = true;
          d3.select('#country_rect')
         .style('stroke-width', 4)
         .style('stroke-opacity',.9)
        ;
      }
      histogram.draw_year(histogram.get_selected_year());
      line.draw_genre_lines('country');
      word_line.draw_genre_lines();
      bubblechart.drawCircles();
  });

  //Folk

  let folk_button = button_svg.append('g')
  .attr('id','folk_box')
  .attr('transform', `translate(250, ${100})`)
 
  folk_button
  .append('rect')
  .attr('id','folk_rect')
  .attr('fill', scaleColor('folk'))
  .attr('width',200)
  .attr('height',50)
  .attr('stroke','black')
  .style('stroke-width', 3)
  .style('stroke-opacity',.5)
  .attr('fill-opacity',1)
 ;
 
 folk_button
  .append('text')
  .text('Folk')
  .attr('transform', `translate(20, ${33})`)
 ;
 
 //Add listeners to check box
 
 d3.select('#folk_rect').on("mouseover", function(event,info){
  d3.select('#folk_rect')
      .style('cursor','pointer')
      .attr('fill-opacity',.85)
 }).on('mouseout',function(){
  d3.select('#folk_rect')
  .style('cursor','default')
  .attr('fill-opacity',1)
  ;
 });

  d3.select('#folk_box').on('click', (d) => 
  {        
    console.log("HERE");
      if (globalApplicationState.folk_checked){
          globalApplicationState.folk_checked = false;
          d3.select('#folk_rect')
         .style('stroke-width', 2)
         .style('stroke-opacity',.5)
         ;
      }
      else{
          globalApplicationState.folk_checked = true;
          d3.select('#folk_rect')
         .style('stroke-width', 4)
         .style('stroke-opacity',.9)
        ;
      }
      histogram.draw_year(histogram.get_selected_year());
      line.draw_genre_lines('folk');
      word_line.draw_genre_lines();
      bubblechart.drawCircles();
  });

  let easy_listening_button = button_svg.append('g')
  .attr('id','easy_listening_box')
  .attr('transform', `translate(470, ${100})`)
 
  easy_listening_button
  .append('rect')
  .attr('id','easy_listening_rect')
  .attr('fill', scaleColor('easy listening'))
  .attr('width',200)
  .attr('height',50)
  .attr('stroke','black')
  .style('stroke-width', 3)
  .style('stroke-opacity',.5)
  .attr('fill-opacity',1)
 ;
 
 easy_listening_button
  .append('text')
  .text('Easy Listening')
  .attr('transform', `translate(20, ${33})`)
 ;
 
 //Add listeners to check box
 
 d3.select('#easy_listening_rect').on("mouseover", function(event,info){
  d3.select('#easy_listening_rect')
      .style('cursor','pointer')
      .attr('fill-opacity',.85)
 }).on('mouseout',function(){
  d3.select('#easy_listening_rect')
  .style('cursor','default')
  .attr('fill-opacity',1)
  ;
 });

  d3.select('#easy_listening_box').on('click', (d) => 
  {        

      if (globalApplicationState.easy_listening_checked){
          globalApplicationState.easy_listening_checked = false;
          d3.select('#easy_listening_rect')
         .style('stroke-width', 2)
         .style('stroke-opacity',.5)
         ;
      }
      else{
          globalApplicationState.easy_listening_checked = true;
          d3.select('#easy_listening_rect')
         .style('stroke-width', 4)
         .style('stroke-opacity',.9)
        ;
      }
      histogram.draw_year(histogram.get_selected_year());
      line.draw_genre_lines('easy listening');
      word_line.draw_genre_lines();
      bubblechart.drawCircles();
  });

  //Latin

  let latin_button = button_svg.append('g')
  .attr('id','latin_box')
  .attr('transform', `translate(690, ${100})`)
 
  latin_button
  .append('rect')
  .attr('id','latin_rect')
  .attr('fill', scaleColor('latin'))
  .attr('width',200)
  .attr('height',50)
  .attr('stroke','black')
  .style('stroke-width', 3)
  .style('stroke-opacity',.5)
  .attr('fill-opacity',1)
 ;
 
 latin_button
  .append('text')
  .text('Latin')
  .attr('transform', `translate(20, ${33})`)
 ;
 
 //Add listeners to check box
 
 d3.select('#latin_rect').on("mouseover", function(event,info){
  d3.select('#latin_rect')
      .style('cursor','pointer')
      .attr('fill-opacity',.85)
 }).on('mouseout',function(){
  d3.select('#latin_rect')
  .style('cursor','default')
  .attr('fill-opacity',1)
  ;
 });

  d3.select('#latin_box').on('click', (d) => 
  {        

      if (globalApplicationState.latin_checked){
          globalApplicationState.latin_checked = false;
          d3.select('#latin_rect')
         .style('stroke-width', 2)
         .style('stroke-opacity',.5)
         ;
      }
      else{
          globalApplicationState.latin_checked = true;
          d3.select('#latin_rect')
         .style('stroke-width', 4)
         .style('stroke-opacity',.9)
        ;
      }
      histogram.draw_year(histogram.get_selected_year());
      line.draw_genre_lines('latin');
      word_line.draw_genre_lines();
      bubblechart.drawCircles();
  });

  //Metal

  let metal_button = button_svg.append('g')
  .attr('id','metal_box')
  .attr('transform', `translate(910, ${100})`)
 
  metal_button
  .append('rect')
  .attr('id','metal_rect')
  .attr('fill', scaleColor('metal'))
  .attr('width',200)
  .attr('height',50)
  .attr('stroke','black')
  .style('stroke-width', 3)
  .style('stroke-opacity',.5)
  .attr('fill-opacity',.7)
 ;
 
 metal_button
  .append('text')
  .text('Metal')
  .attr('transform', `translate(20, ${33})`)
 ;
 
 //Add listeners to check box
 
 d3.select('#metal_rect').on("mouseover", function(event,info){
  d3.select('#metal_rect')
      .style('cursor','pointer')
      .attr('fill-opacity',.5)
 }).on('mouseout',function(){
  d3.select('#metal_rect')
  .style('cursor','default')
  .attr('fill-opacity',.7)
  ;
 });

  d3.select('#metal_box').on('click', (d) => 
  {        

      if (globalApplicationState.metal_checked){
          globalApplicationState.metal_checked = false;
          d3.select('#metal_rect')
         .style('stroke-width', 2)
         .style('stroke-opacity',.5)
         ;
      }
      else{
          globalApplicationState.metal_checked = true;
          d3.select('#metal_rect')
         .style('stroke-width', 4)
         .style('stroke-opacity',.9)
        ;
      }
      histogram.draw_year(histogram.get_selected_year());
      line.draw_genre_lines('metal');
      word_line.draw_genre_lines();
      bubblechart.drawCircles();
  });

  //EDM

  let edm_button = button_svg.append('g')
  .attr('id','edm_box')
  .attr('transform', `translate(1130, ${100})`)
 
  edm_button
  .append('rect')
  .attr('id','edm_rect')
  .attr('fill', scaleColor('edm'))
  .attr('width',200)
  .attr('height',50)
  .attr('stroke','black')
  .style('stroke-width', 3)
  .style('stroke-opacity',.5)
  .attr('fill-opacity',1)
 ;
 
 edm_button
  .append('text')
  .text('EDM')
  .attr('transform', `translate(20, ${33})`)
 ;
 
 //Add listeners to check box
 
 d3.select('#edm_rect').on("mouseover", function(event,info){
  d3.select('#edm_rect')
      .style('cursor','pointer')
      .attr('fill-opacity',.65)
 }).on('mouseout',function(){
  d3.select('#edm_rect')
  .style('cursor','default')
  .attr('fill-opacity',1)
  ;
 });

  d3.select('#edm_box').on('click', (d) => 
  {        

      if (globalApplicationState.edm_checked){
          globalApplicationState.edm_checked = false;
          d3.select('#edm_rect')
         .style('stroke-width', 2)
         .style('stroke-opacity',.5)
         ;
      }
      else{
          globalApplicationState.edm_checked = true;
          d3.select('#edm_rect')
         .style('stroke-width', 4)
         .style('stroke-opacity',.9)
        ;
      }
      histogram.draw_year(histogram.get_selected_year());
      line.draw_genre_lines('edm');
      word_line.draw_genre_lines();
      bubblechart.drawCircles();
  });

 /*
<input type="checkbox" id="love-button" >Love
        <input type="checkbox" id="cool-button" >Cool
        <input type="checkbox" id="dance-button" >Dance
        <input type="checkbox" id="god-button" >God
        <input type="checkbox" id="rock-button" >Rock
        <input type="checkbox" id="swear-button" >Swear Words

        love_checked: true,
    dance_checked: false,
    cool_checked: false,
    god_checked: false,
    rock_checked: false,
    swear_checked: false,
*/

//########################  OPENING AND CLOSING VIEW TITLES  ########################//

d3.select('#view1_title').on('click', (d) => {
    if (globalApplicationState.view1_expanded){
        globalApplicationState.view1_expanded = 0;
        d3.select('#line_svg')
        .transition().ease(d3.easeSin).duration(900)
        .attr('height',0)
        ;
        d3.select('#histogram_svg')
        .transition().ease(d3.easeSin).duration(900)
        .attr('height',0)
        ;
    }else{
        globalApplicationState.view1_expanded = 1;
        d3.select('#line_svg')
        .transition().ease(d3.easeSin).duration(900)
        .attr('height',500)
        ;
        d3.select('#histogram_svg')
        .transition().ease(d3.easeSin).duration(900)
        .attr('height',500)
        ;
    }
    
})

d3.select('#view2_title').on('click', (d) => {
    if (globalApplicationState.view2_expanded){
        globalApplicationState.view2_expanded = 0;
        d3.select('#bubblechart_svg')
        .transition().ease(d3.easeSin).duration(900)
        .attr('height',0)
        ;
    }else{
        globalApplicationState.view2_expanded = 1;
        bubblechart.drawCircles();
    }
    
})

d3.select('#view3_title').on('click', (d) => {
    if (globalApplicationState.view3_expanded){
        globalApplicationState.view3_expanded = 0;
        d3.select('#line_words_svg')
        .transition().ease(d3.easeSin).duration(900)
        .attr('height',0)
        ;
        
        d3.select("#alpha-div")
        .transition().ease(d3.easeSin).duration(900)
        .style('display','none')
        //.attr('opacity',0)
        ;
    }else{
        globalApplicationState.view3_expanded = 1;
        d3.select('#line_words_svg')
        .transition().ease(d3.easeSin).duration(900)
        .attr('height',500)
        ;
        d3.select("#alpha-div")
        .transition().ease(d3.easeSin).duration(900)
        .style('display','inline')
        //.attr('height',40)
        ;
    }
    
})



d3.select("#select-stimulated")
        .selectAll('myOptions')
        .data(["Love","Cool","Dance","God","Rock","Swear Words"])
        .enter()
        .append('option')
        .text(function (d) { return d; }) 
        .attr("value", function (d) { return d; }) 

        const that = this;

        d3.select("#select-stimulated").on("change", function(d) {
            let selectedOption = d3.select(this).property("value");
            if (selectedOption === "Love"){
                  globalApplicationState.love_checked = true;
                  globalApplicationState.dance_checked = false;
                  globalApplicationState.cool_checked = false;
                  globalApplicationState.god_checked = false;
                  globalApplicationState.rock_w_checked = false;
                  globalApplicationState.swear_checked = false;
            }
            if (selectedOption === "Cool"){
                globalApplicationState.love_checked = false;
                globalApplicationState.dance_checked = false;
                globalApplicationState.cool_checked = true;
                globalApplicationState.god_checked = false;
                globalApplicationState.rock_w_checked = false;
                globalApplicationState.swear_checked = false;
          }
             if (selectedOption === "Dance"){
                globalApplicationState.love_checked = false;
                globalApplicationState.dance_checked = true;
                globalApplicationState.cool_checked = false;
                globalApplicationState.god_checked = false;
                globalApplicationState.rock_w_checked = false;
                globalApplicationState.swear_checked = false;
            }
            if (selectedOption === "God"){
                globalApplicationState.love_checked = false;
                globalApplicationState.dance_checked = false;
                globalApplicationState.cool_checked = false;
                globalApplicationState.god_checked = true;
                globalApplicationState.rock_w_checked = false;
                globalApplicationState.swear_checked = false;
            }
            if (selectedOption === "Rock"){
                globalApplicationState.love_checked = false;
                globalApplicationState.dance_checked = false;
                globalApplicationState.cool_checked = false;
                globalApplicationState.god_checked = false;
                globalApplicationState.rock_w_checked = true;
                globalApplicationState.swear_checked = false;
            }
            if (selectedOption === "Swear Words"){
                globalApplicationState.love_checked = false;
                globalApplicationState.dance_checked = false;
                globalApplicationState.cool_checked = false;
                globalApplicationState.god_checked = false;
                globalApplicationState.rock_w_checked = false;
                globalApplicationState.swear_checked = true;
            }
            word_line.draw_main_line();
            word_line.draw_genre_lines();
        })