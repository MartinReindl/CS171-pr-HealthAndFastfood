# This file produces a barchart based on data from the roachDataMaster.csv file

# import relevant libraries
import pandas as pd
from address import AddressParser, Address

ap = AddressParser()

# create dataframe
df = pd.read_csv('restaurants_raw_data/all_restaurants_raw_data.csv', sep=",", header=0)

i = 0
for address in df['State']:
	if("AL" in address):
		df.loc[['State'][i], "AL"]
	
	'''
	if("AK" in address):
		df['State'][i] = "AK"
	if("AZ" in address):
		df['State'][i] = "AZ"
	if("AR" in address):
		df['State'][i] = "AR"
	if("CA" in address):
		df['State'][i] = "CA"
	if("CO" in address):
		df['State'][i] = "CO"
	if("CT" in address):
		df['State'][i] = "CT"
	if("DE" in address):
		df['State'][i] = "DE"
	if("FL" in address):
		df['State'][i] = "FL"
	if("GA" in address):
		df['State'][i] = "GA"
	if("HI" in address):
		df['State'][i] = "HI"
	if("ID" in address):
		df['State'][i] = "ID"
	if("IL" in address):
		df['State'][i] = "IL"
	if("IN" in address):
		df['State'][i] = "IN"
	if("IA" in address):
		df['State'][i] = "IA"
	if("KS" in address):
		df['State'][i] = "KS"
	if("KY" in address):
		df['State'][i] = "KY"
	if("LA" in address):
		df['State'][i] = "LA"
	if("ME" in address):
		df['State'][i] = "ME"
	if("MD" in address):
		df['State'][i] = "MD"
	if("MA" in address):
		df['State'][i] = "MA"
	if("MI" in address):
		df['State'][i] = "MI"
	if("MN" in address):
		df['State'][i] = "MN"
	if("MS" in address):
		df['State'][i] = "MS"
	if("MO" in address):
		df['State'][i] = "MO"
	if("MT" in address):
		df['State'][i] = "MT"
	if("NE" in address):
		df['State'][i] = "NE"
	if("NV" in address):
		df['State'][i] = "NV"
	if("NH" in address):
		df['State'][i] = "NH"
	if("NJ" in address):
		df['State'][i] = "NJ"
	if("NM" in address):
		df['State'][i] = "NM"
	if("NY" in address):
		df['State'][i] = "NY"
	if("NC" in address):
		df['State'][i] = "NC"
	if("ND" in address):
		df['State'][i] = "ND"
	if("OH" in address):
		df['State'][i] = "OH"
	if("OK" in address):
		df['State'][i] = "OK"
	if("OR" in address):
		df['State'][i] = "OR"
	if("PA" in address):
		df['State'][i] = "PA"
	if("RI" in address):
		df['State'][i] = "RI"
	if("SC" in address):
		df['State'][i] = "SC"
	if("SD" in address):
		df['State'][i] = "SD"
	if("TN" in address):
		df['State'][i] = "TN"
	if("TX" in address):
		df['State'][i] = "TX"
	if("UT" in address):
		df['State'][i] = "UT"
	if("VT" in address):
		df['State'][i] = "VT"
	if("VA" in address):
		df['State'][i] = "VA"
	if("WA" in address):
		df['State'][i] = "WA"
	if("WV" in address):
		df['State'][i] = "WV"
	if("WI" in address):
		df['State'][i] = "WI"
	if("WY" in address):
		df['State'][i] = "WY"
	i += 1
	'''

df.to_csv('restaurants_with_states.csv',index=False)








