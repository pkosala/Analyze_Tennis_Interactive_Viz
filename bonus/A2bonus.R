library(maps)
library(ggplot2)
library(rgeos)
library(maptools)
library(tidyr)
library(dplyr)
library(tibble)
library(scales)
map('county', 'arizona', fill = TRUE, col = palette())
az_county_data <- map_data("county")
head(az_county_data)
#transform shapefile to data frame
states.shp <- readShapeSpatial("E:/study materials/DV/lab/lab4/lab_map_2019/2012election/elpo12p010g.shp")
head(states.shp@data)

#get a subset of AZ data from states.shp
az_election_results = subset(states.shp, STATE=="AZ")
head(az_election_results@data)

#merge az_county_data and az_election_results
az_county_data1 = subset(az_county_data, region=="arizona")
head(county.fips) #county.fips is a built-in R function
fips.codes <- county.fips %>%
  # create two new variables, splitting "polyname" on the comma
  separate(polyname, c("region", "subregion"), ",") 
head(fips.codes)
  #introduce FIPS into county data
counties <- full_join(az_county_data1, fips.codes, by=c("region","subregion"))
elec_tib <- as_tibble(az_election_results)
elec_tib1 <- transform(elec_tib, FIPS = as.numeric(levels(elec_tib$FIPS))[elec_tib$FIPS])
counties.elect <- full_join(counties, elec_tib1, by=c("fips"= "FIPS"))
head(counties.elect)

# use ggplot() + geom_polygon() to plot
ggplot(data=counties.elect) + 
  geom_polygon(aes(x=long, y=lat, group=group.x, fill=TTL_VT), colour="black", size=.1) +
  scale_fill_gradient2(low = "white", high = "red", name="vote")
