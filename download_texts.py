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
    "ovid_meta_iii":
        {"url": "http://www.thelatinlibrary.com/ovid/ovid.met3.shtml",
         "css": "body > p:nth-of-type(3)"},
    "ovid_meta_iv":
        {"url": "http://www.thelatinlibrary.com/ovid/ovid.met4.shtml",
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
         "css": "body"},
    "comenius_orbis_pictus_marini_pisces":
        {"url": "https://web.archive.org/web/20120717032053/http://www.grexlat.com/biblio/comenius/35.html",
         "css": "body > font"},
    "comenius_orbis_pictus_pisces_fluviales":
        {"url": "https://web.archive.org/web/20120207164150/http://www.grexlat.com/biblio/comenius/34.html",
         "css": "body > font"},
    "comenius_orbis_pictus_terrae_foetus":
        {"url": "https://web.archive.org/web/20120204081655/http://www.grexlat.com/biblio/comenius/10.html",
         "css": "body > blockquote > blockquote > blockquote > font"},
    "comenius_orbis_pictus_planetarum_aspectus":
        {"url": "https://web.archive.org/web/20120204082013/http://www.grexlat.com/biblio/comenius/104b.html",
         "css": "body > font > p:nth-of-type(1)"},
    "comenius_orbis_pictus_eques":
        {"url": "https://web.archive.org/web/20120204081950/http://www.grexlat.com/biblio/comenius/84.html",
         "css": "body > font"},
    "comenius_orbis_pictus_insecta_volantia":
        {"url": "https://web.archive.org/web/20120204081830/http://www.grexlat.com/biblio/comenius/25.html",
         "css": "body > font > p:nth-of-type(1)"}}

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
