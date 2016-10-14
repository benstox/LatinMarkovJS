#!/usr/bin/env python3
import os
import re
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
         "css": "body"},
    "voragine_leg_aur_georgio":
        {"url": "http://www.thelatinlibrary.com/voragine/georgio.shtml",
          "css": "body"},
    "biblia_evang_sec_joan_i":
        {"url": "http://www.thelatinlibrary.com/bible/john.shtml",
         "css": "body"}}

script_tags = []
for to_do, page in pages.items():
    r = requests.get(page["url"])
    s = BeautifulSoup(r.content, "lxml")
    text = s.select(page["css"])[0].text

    tokenizer = RegexpTokenizer(r'[a-zA-Z]+')  # [\w]+ leaves numbers in
    tokens = tokenizer.tokenize(text)

    file = os.path.join(directory, to_do + ".js")
    with open(file, "w") as textfile:
        textfile.write('var {} = "'.format(to_do) + " ".join(tokens) + '";')

    script_tags.append('<script class="training-text" src="{}"></script>'.format(file))

with open("page_template.html", "r") as template_file:
    template = template_file.read()

template = re.sub("\{\{ text_files \}\}", '\n    '.join(script_tags), template)
with open("page.html", "w") as output:
    output.write(template)
