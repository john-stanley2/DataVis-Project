
var LINE_WIDTH = 900;
var POP_WORDS_WIDTH = 900;

let wrapper = d3.select("body")
    .append('div')
    .attr('id', 'wrapper_div')
;
let head_div = wrapper.append('div')
        .attr("id", 'head_div')
;
let lineDiv = wrapper.append('div')
                .attr("id", 'line_div')
                .style('width', '900px')
                .style('float', 'left')
;
let popWordsDiv = wrapper.append('div')
                .attr("id", 'pop_words_div')
                // .style('width', '900px')
                // .style('float', 'left')
;
let lineWordsDiv = wrapper.append('div')
                .attr("id", 'line_words_div')
;

let histogramDiv = wrapper.append('div')
                .attr("id", 'histogram_div')
;
let allGenres =  ["pop", 'rock', 'hip hop', 'latin', 'edm', 'r&b', 
'country', 'folk',  'metal', 'jazz', 'easy listening', 'new age', 'blues', 'world']
;

// scaleColor = d3.scaleOrdinal() 
//         .domain(allGenres)
//         .range(["#11C67A", "#FFC60D" , "#076CFD", "#FDB9CB", "#F87D1F", "#EA3636"]);

let scaleColor = d3.scaleOrdinal(d3.schemeTableau10).domain(allGenres)
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
    new_age_checked: false,
    blues_checked: false,
    world_checked: false,
    scaleColor,
    love_checked: false,
    dance_checked: false,
    cool_checked: false,
    god_checked: false,
    rock_w_checked: false,
    swear_checked: false,
  };

        

//for the first view
main_line_data = d3.json("./vis_data/main_line.json");
genre_lines_data = d3.json('./vis_data/genre_lines.json');
word_freq_data = d3.json('./vis_data/word_freq.json');
overall_word_freq_data = d3.json('./vis_data/word_freq_year.json');

Promise.all([main_line_data,genre_lines_data,word_freq_data,overall_word_freq_data]).then( data =>
    {
        //data[0] = main_line_data
        //data[1] = genre_line_data
        console.log("main line", data[0]);
        console.log("genre line", data[1]);
        console.log("word frequency", data[2]);
        console.log("overall word frequency", data[3]);

        // histogram = new Historgram(data[0], data[1],histogramDiv ,globalApplicationState)
        line = new Line(data[0], data[1],lineDiv ,globalApplicationState);
        word_line = new Word_Line(data[2],data[3],lineWordsDiv,globalApplicationState);
        word_line.draw_main_line();

    });

 //Add a listener to check box

 //ROCK
 d3.select('#rock_box').on('click', (d) => 
 {        
     if (globalApplicationState.rock_checked){
         globalApplicationState.rock_checked = false
     }
     else{
         globalApplicationState.rock_checked = true
     }
     line.draw_genre_lines();
     word_line.draw_genre_lines();
 });

 //POP
 d3.select('#pop_box').on('click', (d) => 
 {        
     if (globalApplicationState.pop_checked){
         globalApplicationState.pop_checked = false
     }
     else{
         globalApplicationState.pop_checked = true
     }
     line.draw_genre_lines();
     word_line.draw_genre_lines();
 });

 //HIP HOP
 d3.select('#hip_hop_box').on('click', (d) => 
 {        
     if (globalApplicationState.hip_hop_checked){
         globalApplicationState.hip_hop_checked = false
     }
     else{
         globalApplicationState.hip_hop_checked = true
     }
     line.draw_genre_lines()
     word_line.draw_genre_lines();
 });


 //JAZZ
 d3.select('#jazz_box').on('click', (d) => 
 {        
     if (globalApplicationState.jazz_checked){
         globalApplicationState.jazz_checked = false
     }
     else{
         globalApplicationState.jazz_checked = true
     }
     line.draw_genre_lines()
 });

 //BLUES
 d3.select('#blues_box').on('click', (d) => 
 {        
     if (globalApplicationState.blues_checked){
         globalApplicationState.blues_checked = false
     }
     else{
         globalApplicationState.blues_checked = true
     }
     line.draw_genre_lines()
 });

  //R&B
  d3.select('#r_b_box').on('click', (d) => 
  {        
      if (globalApplicationState.rnb_checked){
          globalApplicationState.rnb_checked = false
      }
      else{
          globalApplicationState.rnb_checked = true
      }
      line.draw_genre_lines()
  });

  //country
  d3.select('#country_box').on('click', (d) => 
  {        
    

      if (globalApplicationState.country_checked){
          globalApplicationState.country_checked = false
      }
      else{
          globalApplicationState.country_checked = true
      }
      line.draw_genre_lines();
      word_line.draw_genre_lines();
  });

  d3.select('#folk_box').on('click', (d) => 
  {        

      if (globalApplicationState.folk_checked){
          globalApplicationState.folk_checked = false
      }
      else{
          globalApplicationState.folk_checked = true
      }
      line.draw_genre_lines()
  });

  d3.select('#easy_listening_box').on('click', (d) => 
  {        

      if (globalApplicationState.easy_listening_checked){
          globalApplicationState.easy_listening_checked = false
      }
      else{
          globalApplicationState.easy_listening_checked = true
      }
      line.draw_genre_lines()
  });



  /////Word Count buttons

  d3.select('#love-button').on('click', (d) => 
  {        
      if (globalApplicationState.love_checked){
          //globalApplicationState.love_checked = false
      }
      else{
        globalApplicationState.love_checked = true;
        globalApplicationState.dance_checked = false;
        globalApplicationState.cool_checked = false;
        globalApplicationState.god_checked = false;
        globalApplicationState.rock_w_checked = false;
        globalApplicationState.swear_checked = false;
      }
      line.draw_genre_lines();
      word_line.draw_main_line();
      word_line.draw_genre_lines();
  });

  d3.select('#cool-button').on('click', (d) => 
  {        
      if (globalApplicationState.cool_checked){
          //globalApplicationState.cool_checked = false
      }
      else{
        globalApplicationState.love_checked = false;
        globalApplicationState.dance_checked = false;
        globalApplicationState.cool_checked = true;
        globalApplicationState.god_checked = false;
        globalApplicationState.rock_w_checked = false;
        globalApplicationState.swear_checked = false;
      }
      line.draw_genre_lines();
      word_line.draw_main_line();
      word_line.draw_genre_lines();
  });

  d3.select('#dance-button').on('click', (d) => 
  {        
      if (globalApplicationState.dance_checked){
          //globalApplicationState.dance_checked = false
      }
      else{
        globalApplicationState.love_checked = false;
        globalApplicationState.dance_checked = true;
        globalApplicationState.cool_checked = false;
        globalApplicationState.god_checked = false;
        globalApplicationState.rock_w_checked = false;
        globalApplicationState.swear_checked = false;
      }
      line.draw_genre_lines();
      word_line.draw_main_line();
      word_line.draw_genre_lines();
  });

  d3.select('#god-button').on('click', (d) => 
  {        
      if (globalApplicationState.god_checked){
          //globalApplicationState.god_checked = false
      }
      else{
        globalApplicationState.love_checked = false;
        globalApplicationState.dance_checked = false;
        globalApplicationState.cool_checked = false;
        globalApplicationState.god_checked = true;
        globalApplicationState.rock_w_checked = false;
        globalApplicationState.swear_checked = false;
      }
      line.draw_genre_lines();
      word_line.draw_main_line();
      word_line.draw_genre_lines();
  });
 
  d3.select('#rock-button').on('click', (d) => 
  {        
      if (globalApplicationState.rock_w_checked){
          //globalApplicationState.rock_w_checked = false
      }
      else{
        globalApplicationState.love_checked = false;
        globalApplicationState.dance_checked = false;
        globalApplicationState.cool_checked = false;
        globalApplicationState.god_checked = false;
        globalApplicationState.rock_w_checked = true;
        globalApplicationState.swear_checked = false;
      }
      line.draw_genre_lines();
      word_line.draw_main_line();
      word_line.draw_genre_lines();
  });

  d3.select('#swear-button').on('click', (d) => 
  {        
      if (globalApplicationState.swear_checked){
          //globalApplicationState.swear_checked = false
      }
      else{
        globalApplicationState.love_checked = false;
        globalApplicationState.dance_checked = false;
        globalApplicationState.cool_checked = false;
        globalApplicationState.god_checked = false;
        globalApplicationState.rock_w_checked = false;
        globalApplicationState.swear_checked = true;
      }
      line.draw_genre_lines();
      word_line.draw_main_line();
      word_line.draw_genre_lines();
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