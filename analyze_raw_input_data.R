library(tidyverse)
library(dplyr)
library(jsonlite)


setwd("/Users/sam/Desktop/U_of_U/Fall_2022/data_vis/new_final/DataVis-Project/source_code/vis_data")

#read all of the csv's
raw_csv1 <- read_delim("../../input_data/albums_0_96.csv", delim = "|")
raw_csv2 <- read_delim("../../input_data/albums_97_335.csv", delim = "|")
raw_csv3 <- read_delim("../../input_data/albums_336_600.csv", delim = "|")
raw_csv4 <- read_delim("../../input_data/albums_600_ 827.csv", delim = "|")
raw_csv5 <- read_delim("../../input_data/albums_827_1500.csv", delim = "|")




#combine all the csv's
all_songs <- bind_rows(raw_csv1,raw_csv2,raw_csv3,raw_csv4,raw_csv5) %>% 
  filter(totalWords < 5000) #Filter because some songs seem to have returned paragraph written about the song, not the lyrics

#Work with the most common words (skip for now)
# all_songs %>% select(genre, year, contains("cw")) %>%
#   group_by(cw1, cw2, cw3,cw4,cw5,genre) %>%
#   summarise(sum1 = sum(cwc1),sum2 = sum(cwc2),sum3 = sum(cwc3),sum4 = sum(cwc4),sum5 = sum(cwc5)) %>%
#   View()

#Df for line chart

#Main line (all genres combined)
all_songs %>% 
  mutate(metric = numUnique/totalWords) %>%
  group_by(year) %>%
  summarise(median_metric = median(metric, na.rm = T)) -> main_line_df

write_json(main_line_df, "main_line.json",dataframe = 'rows')

#Genre lines
all_songs %>% 
  mutate(metric = numUnique/totalWords) %>%
  group_by(genre, year) %>%
  summarise(median_metric = median(metric, na.rm = T)) -> genre_lines_df

write_json(genre_lines_df, "genre_lines.json",dataframe = 'rows')


all_songs %>%
  group_by(year, genre) %>%
  summarise( n = n(),
             love_sum = sum(love_words), 
             love_norm = love_sum/n,  
             swear_sum = sum(swear_words),
             swear_norm = swear_sum/n,
             god_sum = sum(god_words),
             god_norm = god_sum/n,
             dance_sum = sum(dance_words),
             dance_norm = dance_sum/n,
             cool_sum = sum(cool_words),
             cool_norm = cool_sum/n,
             rock_sum = sum(rock_words),
             rock_norm = rock_sum/n) -> word_freq_df

write_json(word_freq_df, "word_freq.json",dataframe = 'rows')




