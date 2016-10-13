#!/usr/bin/env python3
import os
import requests

from bs4 import BeautifulSoup
from nltk.tokenize import RegexpTokenizer

# create an output directory
directory = "texts"
if not os.path.exists(directory):
    os.makedirs(directory)

pages = {
    "ovid_meta_i":
        {"url": "http://www.thelatinlibrary.com/ovid/ovid.met1.shtml",
         "css": "body > p:nth-of-type(3)"},
    "augustine_conf_i":
        {"url": "http://www.thelatinlibrary.com/augustine/conf1.shtml",
         "css": "body"}}

for to_do, page in pages.items():
    r = requests.get(page["url"])
    s = BeautifulSoup(r.content, "lxml")
    text = s.select(page["css"])[0].text

    tokenizer = RegexpTokenizer(r'[a-zA-Z]+')  # [\w]+ leaves numbers in
    tokens = tokenizer.tokenize(text)

    with open(os.path.join(directory, to_do + ".txt"), "w") as textfile:
        textfile.write(" ".join(tokens))
