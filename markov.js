var reverse = function(s) {
  return s.split('').reverse().join('');
};

var capitalizeFirstLetter = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

var getWordsFromText = function(text) {
    var words = text.split(" ");
    return(words);
};

var getWordsStartingWith = function(words, starting) {
    words = words.filter(function (x) {return(x.startsWith(starting));});
    return(words);
};

var getWordsEndingWith = function(words, starting) {
    words = words.filter(function (x) {return(x.endsWith(starting));});
    return(words);
};

var getWordsOfMinLength = function(words, min_length) {
    words = words.filter(function (x) {return(x.length >= min_length);});
    return(words);
};

var separateLetters = function(words) {
    for (var i = 0; i < words.length; i++) {
        words[i] = words[i].split("").join(" ");
    };
    return(words);
};

function getUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

texts = $.map($(".training-text"), function(x) {
    return(/([^/]+)(?=\.js)/.exec(x.src));}).filter(getUnique);
var text = $.map(texts, function(x) {return window[x];}).join(' ');
text = text.toLowerCase();

var words = getWordsFromText(text);
var endings = {"feminine": "a", "masculine": "um", "neuter": "um"};
var gender_words = {};
for (var key in endings) {
    var words_of_gender = getWordsOfMinLength(getWordsEndingWith(words, endings[key]), 4);
    gender_words[key] = separateLetters(words_of_gender);
};

words = separateLetters(gender_words["feminine"]);
var terminals = {};
var startletters = [];
var letterstats = {};

for (var i = 0; i < words.length; i++) {
    var letters = words[i].split(' ');
    terminals[letters[letters.length-1]] = true;
    startletters.push(letters[0]);
    for (var j = 0; j < letters.length - 1; j++) {
        if (letterstats.hasOwnProperty(letters[j])) {
            letterstats[letters[j]].push(letters[j+1]);
        } else {
            letterstats[letters[j]] = [letters[j+1]];
        }
    }
}

var choice = function (a) {
    var i = Math.floor(a.length * Math.random());
    return a[i];
};

var make_name = function (min_length) {
    letter = choice(startletters);
    var name = [letter];
    while (letterstats.hasOwnProperty(letter)) {
        var next_letters = letterstats[letter];
        letter = choice(next_letters);
        name.push(letter);
        console.log(name.length);
        if (name.length > min_length && terminals.hasOwnProperty(letter)) break;
    }
    if (name.length < min_length) return make_name(min_length);
    return capitalizeFirstLetter(name.join(''));
};

var name = make_name(5 + Math.floor(3 * Math.random()));

$("#name-goes-here").text(name);
