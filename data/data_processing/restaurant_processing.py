# This file produces a barchart based on data from the roachDataMaster.csv file

# import relevant libraries
import pandas as pd
import numpy as np
from address import AddressParser, Address

ap = AddressParser()

# create dataframe
df = pd.read_csv('restaurants_raw_data/all_restaurants_raw_data.csv', sep=",", header=0)
state_abbreviations = pd.read_csv('state_abbreviations.csv', sep=",", header=0)

restaurants = ["BurgerKing", "DQ", "McDonalds", "Starbucks"]

def find_abbrev(addr):
	for abbrev in state_abbreviations["abbreviation"]:
		if abbrev in addr:
			return abbrev
	print "hit it"
	return float('NaN')

def remove_ending(str):
	for resto in restaurants:
		if resto in str:
			return resto
	print "hit it"
	return float('NaN')

df['State'] = df['State'].apply(lambda x: find_abbrev(x)) 
df['Restaurant'] = df['Restaurant'].apply(lambda x: remove_ending(x))
df.dropna(how='any', )

df.to_csv('restaurants_with_states.csv',index=False)







