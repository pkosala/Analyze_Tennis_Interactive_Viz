import pandas as pd
import numpy as np
from sklearn.manifold import MDS
import codecs
import json

df = pd.read_csv("10yearAUSOpenMatches.csv")
df = df.dropna()
wd = df.as_matrix(columns = df.columns[range(9, 37, 2)])
ld = df.as_matrix(columns = df.columns[range(10, 37, 2)])
wd = wd.astype(float)
ld = ld.astype(float)

final_data = (np.concatenate((wd, ld)))

embedding = MDS(n_components=2)
td = embedding.fit_transform(final_data)

td = td.tolist() # nested lists with same data, indices
file_path = "mds_data.json" ## your path variable
json.dump(td, open(file_path, 'w'), separators=(',', ':'), sort_keys=True, indent=4)