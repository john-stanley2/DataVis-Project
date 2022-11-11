raw_csv <- read_csv("~/Desktop/U_of_U/Fall_2022/data_vis/final_project/DataVis-Project/input_data/songs_5_500.csv")

raw_csv %>% 
  mutate(metric = numUnique/totalWords) %>%
  group_by(genre, year) %>%
  summarise(median_metric = median(metric)) %>%
  ggplot(aes(x = year, y = median_metric, color = genre)) + 
  geom_line() 

raw_csv %>% 
  group_by(year) %>%
  summarise(n = n()) %>%
  ggplot(aes(x = year, y = n)) + 
  geom_line() 


raw_csv %>% 
  mutate(metric = numUnique/totalWords) %>%
  group_by( year) %>%
  summarise(median_metric = median(metric)) %>%
  ggplot(aes(x = year, y = median_metric)) + 
  geom_line() 


raw_csv %>% 
  group_by(genre, year) %>%
  summarise(n_songs = n(),
            love_total = sum(love_words)/n_songs,
            swear_total = sum(swear_words)/n_songs,
            rock_total = sum(rock_words)/n_songs) %>%
  ggplot(aes(x = genre, y = median_metric)) + 
  geom_bar(stat = 'identity')