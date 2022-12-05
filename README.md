# DataVis-Project

WEBSITE: https://john-stanley2.github.io/DataVis-Project/

Tutorial Video: https://www.youtube.com/watch?v=RSo8qP2dAfY

Process Book: 'Process Book_final'

Website uses 'js', 'vis_data', 'index.html', and 'styles.css'. All other R and jupyter notebooks contain code for pulling data using API's, data analysis, and building final json's.

'data' contains genre information and initial album title list. When extracting song genre, we were given subgenres. The genre files help us map these subgenres to their supergenre. The album title list we got from http://www.acclaimedmusic.net/year/alltime_albums.htm . These were the albums searched for through the genius and spotify API's.

'input_data' contains intermediate data. This data comes after extracting the albums and analyzing the lyrics of each song.

'vis_data' contains the fully processed data. The data from input_data was concatenated, aggregated and analyzed, and then converted to a more usable json format. This is the data used directly by the website.

Peer Feedback and Process_Book contain documentation on the development of the website and visualizations.

Other python and R code contain the code used to extract, analyze, and convert data into json format.
