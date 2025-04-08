import math
from collections import Counter
from datetime import datetime

import pandas as pd
import sys


def isNumber(num):
    try:
        return not math.isnan(float(num))
    except Exception as e:
        return False


def isDate(date, date_format="%Y-%m-%d %H:%M:%S"):
    try:
        datetime.strptime(str(date), date_format)
        return True
    except ValueError:
        return False


# Calculate the sum of values for each date and its count
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


if __name__ == '__main__':
    filename = sys.argv[1]
    # calculate the average value for each hour in the file
    avg = calc_sum_and_div(filename)
    df = pd.DataFrame(list(avg.items()), columns=['time', 'average'])
    df.to_excel('output_avg1.xlsx', index=False)
