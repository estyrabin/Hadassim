import sys
from collections import Counter

import pandas as pd


# calculate the sum of the overall errors
# Time Complexity: O(n*m)
# n = num of files
# m =  count_file_errors
# for each file we call to count_file_errors
# Space Complexity = O(e*n) : e: num of errors * files
def count_errors(files):
    error_counts = Counter()
    for file in files:
        error_counts += count_file_errors(file)
    return error_counts


# calculate the sum of the error of the file
# Time cmplexity O(n)
#  n = num of line un the file
#ierating through all the lines in the file with a calc of O(1)
# Space Complexity = O(e) : e: num of errors
def count_file_errors(file):
    error_counts = Counter()
    df = pd.read_excel(file)

    for row in df.itertuples(index=False):
        if row and row[0]:
            parts = row[0].split(", ")
            if len(parts) == 2:
                error = parts[1].split(": ")[1]
                error_counts[error] += 1
    return error_counts


# split the file into separate files
# Time Complexity: O(n + m*k) = O(n)
# n = num of line un the file
# m = rows
# k = num of files
# We iterate through each line in the file:n, 
# and for every m lines, we open a new file, resulting in a total of k files:m*k
# Space Complexity = O(m*k) = O(n)

def split_data(file_name, rows):
    df = pd.read_excel(file_name)
    total_rows = len(df)
    num_files = int((total_rows + rows - 1) / rows)

    files = set()

    for i in range(num_files):
        start = i * rows
        end = min((i + 1) * rows, total_rows)
        chunk = df.iloc[start:end]
        new_file = f'new_file_{i + 1}.xlsx'
        files.add(new_file)
        chunk.to_excel(new_file, index=False)

    return files

if __name__ == '__main__':
    file_name = sys.argv[1]
    n = int (sys.argv[2])

    files = split_data(file_name, 50000) 
    nums_of_error = count_errors(files)

    sorted_nums_of_error = dict(sorted(nums_of_error.items(), key=lambda item: item[1])) # sort : O(e log e)
    error = dict(list(sorted_nums_of_error.items())[:n]).keys() # O(e)

    for e in error:
        print(e)



# Time Complexity: = O(n) + O(m * O(k)) +  O(e log e) + O(e) = O(n)
# Space Complexity = O(n) + O(m * O(e)) + O(e) = O(n)