import math
import sys
from collections import Counter

import pandas as pd


def isNumber(num):
    try:
        return not math.isnan(float(num))
    except Exception as e:
        return False


# split the file into separate files by day
def split_file(file_name):
    import pandas as pd

    df = pd.read_excel(file_name)
    date_column = df.columns[0]  # column Name

    df[date_column] = pd.to_datetime(df[date_column], errors='coerce')
    df = df.dropna(subset=[date_column])

    df['date'] = df[date_column].dt.date
    grouped = df.groupby('date')

    files = set()

    for date, group in grouped:
        output_df = group[[date_column, df.columns[1]]]
        output_filename = f'output_{date}.xlsx'
        output_df.to_excel(output_filename, index=False)
        files.add(output_filename)

    return files


# calculate the sum of values for each date and its count
def calc_sum_and_div(file):
    df = pd.read_excel(file)

    sums = Counter()
    divider = Counter()
    times = set()

    for row in df.itertuples(index=False):
        dt = pd.to_datetime(row[0])
        num = row[1]

        if isNumber(num):
            if dt not in times:
                date = dt.date()
                hour = dt.hour
                key = f"{date} {hour}:00:00"
                sums[key] += float(num)
                divider[key] += 1
                times.add(dt)

    return calc_avg(sums, divider)


# Calculate the average by dividing the sum by the divider
def calc_avg(sums, divider):
    avg = {}
    for key in sums:
        if key in divider and divider[key] != 0:
            avg[key] = sums[key] / divider[key]
        else:
            avg[key] = None
    return avg


# merge the list of average dictionaries into a single dictionary to calculate the overall average
def mrg_avg(averages):
    merged_avg = {}
    sums = {}
    counts = {}

    for avg in averages:
        for hour, num in avg.items():
            sums[hour] = sums.get(hour, 0) + num
            counts[hour] = counts.get(hour, 0) + 1

    for hour in sums:
        merged_avg[hour] = sums[hour] / counts[hour]

    return merged_avg


if __name__ == '__main__':
    filename = sys.argv[1]
    files = split_file(filename)

    # calculate the average value for each hour in each file
    averages_list = []
    for file in files:
        averages_list.append(calc_sum_and_div(file))

    # calculating the overall average
    avg = mrg_avg(averages_list)

    # writing the average to a new xlsx file
    df = pd.DataFrame(list(avg.items()), columns=['time', 'average'])
    df.to_excel('output_avg2.xlsx', index=False)
