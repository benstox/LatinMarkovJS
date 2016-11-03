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

ENDINGS_TO_CUT = (
    "Submitted by",
    "Scanned by",
    "The Bible",
    "Christian Latin",
    "Seneca the Younger",
    "The Latin Library",
)

pages = {
    "ovid_meta_i":
        {"url": "http://www.thelatinlibrary.com/ovid/ovid.met1.shtml",
         "css": "body > p:nth-of-type(3)"},
    "ovid_meta_ii":
        {"url": "http://www.thelatinlibrary.com/ovid/ovid.met2.shtml",
         "css": "body > p:nth-of-type(3)"},
    "augustine_conf_i":
        {"url": "http://www.thelatinlibrary.com/augustine/conf1.shtml",
         "css": "body"},
    "voragine_leg_aur_georgii":
        {"url": "http://www.thelatinlibrary.com/voragine/georgio.shtml",
         "css": "body"},
    "voragine_leg_aur_christophori":
        {"url": "http://www.thelatinlibrary.com/voragine/chris.shtml",
         "css": "body"},
    "voragine_leg_aur_nicholai":
        {"url": "http://www.thelatinlibrary.com/voragine/nic.shtml",
         "css": "body"},
    "voragine_leg_aur_septem_dormientum":
        {"url": "http://www.thelatinlibrary.com/voragine/septem.shtml",
         "css": "body"},
    "biblia_evang_sec_joan_i":
        {"url": "http://www.thelatinlibrary.com/bible/john.shtml",
         "css": "body"},
    "seneca_de_beneficiis_i":
        {"url": "http://www.thelatinlibrary.com/sen/ben1.shtml",
         "css": "body"},
    "catullus":
        {"url": "http://www.thelatinlibrary.com/catullus.shtml",
         "css": "body"},
    "dies_irae":
        {"url": "http://www.thelatinlibrary.com/diesirae.html",
         "css": "body"},
    "tertullian_de_monogamia_i":
        {"url": "http://www.thelatinlibrary.com/tertullian/tertullian.monog.shtml",
         "css": "body"}}

script_tags = []
for to_do, page in pages.items():
    r = requests.get(page["url"])
    s = BeautifulSoup(r.content, "lxml")
    text = s.select(page["css"])[0].text

    tokenizer = RegexpTokenizer(r'[a-zA-Z]+')  # [\w]+ leaves numbers in
    tokens = tokenizer.tokenize(text)

    token_string = " ".join(tokens)
    for ending in ENDINGS_TO_CUT:
        try:
            ending_index = token_string.index(ending)
            token_string = token_string[:ending_index-1]
        except ValueError:
            continue

    filename = os.path.join(directory, to_do + ".js")
    if not os.path.isfile(filename):
        with open(filename, "w") as textfile:
            textfile.write('var {} = "'.format(to_do) + token_string + '";')

    script_tags.append('<script class="training-text" src="{}"></script>'.format(filename))

with open("page_template.html", "r") as template_file:
    template = template_file.read()

template = re.sub("\{\{ text_files \}\}", '\n    '.join(script_tags), template)
with open("page.html", "w") as output:
    output.write(template)
