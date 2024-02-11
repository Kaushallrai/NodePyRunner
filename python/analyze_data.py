# For numerical analysis
import numpy as np
# To store and process data in DataFrame
import pandas as pd

from tabulate import tabulate

# Full data
full_table = pd.read_csv('python/covid_19_clean_complete.csv')

# Grouped by day, country
full_grouped = pd.read_csv('python/full_grouped.csv')
full_grouped['Date'] = pd.to_datetime(full_grouped['Date'])

# Extract week number and month from 'Date' column
full_grouped['Week Number'] = full_grouped['Date'].dt.isocalendar().week
full_grouped['Month'] = full_grouped['Date'].dt.month

# Day wise
day_wise = pd.read_csv('python/day_wise.csv')
day_wise['Date'] = pd.to_datetime(day_wise['Date'])

# Country wise
country_wise = pd.read_csv('python/country_wise_latest.csv')
country_wise = country_wise.replace('', np.nan).fillna(0)

# Worldometer data
worldometer_data = pd.read_csv('python/worldometer_data.csv')
worldometer_data = worldometer_data.replace('', np.nan).fillna(0)

# Latest
temp = day_wise[['Date','Deaths', 'Recovered', 'Active']].tail(1)
temp = temp.melt(id_vars="Date", value_vars=['Active', 'Deaths', 'Recovered'])

# USA
usa_df = pd.read_csv('python/usa_county_wise.csv')
usa_latest = usa_df[usa_df['Date'] == max(usa_df['Date'])]
usa_grouped = usa_latest.groupby('Province_State')[['Confirmed', 'Deaths']].sum().reset_index()

# WHO Region Wise
who = country_wise.groupby('WHO Region')[['Confirmed', 'Deaths', 'Recovered', 'Active',
                                         'New cases', 'Confirmed last week']].sum().reset_index()

who['Fatality Rate'] = round((who['Deaths'] / who['Confirmed']) * 100, 2)
who['Recovery Rate'] = (who['Recovered'] / who['Confirmed']) * 100

who_g = full_grouped.groupby(['WHO Region', 'Date'])[['Confirmed', 'Deaths', 'Recovered',
                                                      'Active', 'New cases', 'New deaths']].sum().reset_index()

# Weekly Statistics
week_wise = full_grouped.groupby('Week Number')[['Confirmed', 'Deaths', 'Recovered', 'Active', 'New cases', 'New deaths', 'New recovered']].sum().reset_index()

# Monthly statistics
month_wise = full_grouped.groupby('Month')[['Confirmed', 'Deaths', 'Recovered', 'Active', 'New cases', 'New deaths', 'New recovered']].sum().reset_index()

# Countries with no more active cases
temp = country_wise[country_wise['Active']==0]
temp = temp.sort_values('Confirmed', ascending=False)
temp.reset_index(drop=True)



# Print the dataframes
# print("Full Table:\n", tabulate(full_table.head(), headers='keys', tablefmt='psql'))
# print("\nFull Grouped:\n", tabulate(full_grouped.head(), headers='keys', tablefmt='psql'))
# print("\nDay Wise:\n", tabulate(day_wise.head(), headers='keys', tablefmt='psql'))
# print("\nCountry Wise:\n", tabulate(country_wise.head(), headers='keys', tablefmt='psql'))
# print("\nWorldometer Data:\n", tabulate(worldometer_data.head(), headers='keys', tablefmt='psql'))
# print("\nTemp:\n", tabulate(temp.head(), headers='keys', tablefmt='psql'))
# print("\nUSA Grouped:\n", tabulate(usa_grouped.head(), headers='keys', tablefmt='psql'))
# print("\nWHO:\n", tabulate(who.head(), headers='keys', tablefmt='psql'))
# print("\nWHO G:\n", tabulate(who_g.head(), headers='keys', tablefmt='psql'))
# print("\nWeek Wise:\n", tabulate(week_wise.head(), headers='keys', tablefmt='psql'))
# print("\nMonth Wise:\n", tabulate(month_wise.head(), headers='keys', tablefmt='psql'))


# Write the dataframes to a text file
with open('statistics.txt', 'w') as f:
    f.write("Full Table:\n")
    f.write(tabulate(full_table.head(), headers='keys', tablefmt='psql'))
    f.write("\n\nFull Grouped:\n")
    f.write(tabulate(full_grouped.head(), headers='keys', tablefmt='psql'))
    f.write("\n\nDay Wise:\n")
    f.write(tabulate(day_wise.head(), headers='keys', tablefmt='psql'))
    f.write("\n\nCountry Wise:\n")
    f.write(tabulate(country_wise.head(), headers='keys', tablefmt='psql'))
    f.write("\n\nWorldometer Data:\n")
    f.write(tabulate(worldometer_data.head(), headers='keys', tablefmt='psql'))
    f.write("\n\nTemp:\n")
    f.write(tabulate(temp.head(), headers='keys', tablefmt='psql'))
    f.write("\n\nUSA Grouped:\n")
    f.write(tabulate(usa_grouped.head(), headers='keys', tablefmt='psql'))
    f.write("\n\nWHO:\n")
    f.write(tabulate(who.head(), headers='keys', tablefmt='psql'))
    f.write("\n\nWHO G:\n")
    f.write(tabulate(who_g.head(), headers='keys', tablefmt='psql'))
    f.write("\n\nWeek Wise:\n")
    f.write(tabulate(week_wise.head(), headers='keys', tablefmt='psql'))
    f.write("\n\nMonth Wise:\n")
    f.write(tabulate(month_wise.head(), headers='keys', tablefmt='psql'))