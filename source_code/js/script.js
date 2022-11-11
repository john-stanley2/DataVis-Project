
var LINE_WIDTH = 900
var POP_WORDS_WIDTH = 900

let wrapper = d3.select("body")
    .append('div')
    .attr('id', 'wrapper_div')

let head_div = wrapper.append('div')
        .attr("id", 'head_div')

let lineDiv = wrapper.append('div')
                .attr("id", 'line_div')
                .style('width', '900px')
                .style('float', 'left')

let popWordsDiv = wrapper.append('div')
                .attr("id", 'pop_words_div')
                // .style('width', '900px')
                // .style('float', 'left')

let lineWordsDiv = wrapper.append('div')
                .attr("id", 'line_words_div')

let allGenres =  ["pop", 'rock', 'hip hop', 'latin', 'edm', 'r&b', 
'country', 'folk',  'metal', 'jazz', 'easy listening', 'new age', 'blues', 'world']


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
    scaleColor
  };

        


//for the first view
main_line_data = d3.json("./vis_data/main_line.json")
genre_lines_data = d3.json('./vis_data/genre_lines.json');

Promise.all([main_line_data,genre_lines_data]).then( data =>
    {
        //data[0] = main_line_data
        //data[1] = genre_line_data
        console.log("main line", data[0])
        console.log("genre line", data[1])

        line = new Line(data[0], data[1],lineDiv ,globalApplicationState)

       


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
     line.draw_genre_lines()
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
     line.draw_genre_lines()
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





