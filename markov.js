var CONSONANTS = "bcdfghjklmnpqrstvwxz";
var VOWELS = "aeiouy";
var SONORANTS = "lrmn";
var BAD_COMBINATIONS = [
    new RegExp("qu[" + CONSONANTS + "]"),
    new RegExp("^[" + SONORANTS + "][" + CONSONANTS + "]"),
    new RegExp("gn[" + CONSONANTS + "]"),
    /pspt/,
    /rbd/,
    new RegExp("[" + SONORANTS + "]cc"),
    new RegExp("[" + CONSONANTS + "][" + SONORANTS + "][" + CONSONANTS + "]"),
    new RegExp("[" + CONSONANTS + "]{5}"),
    new RegExp("[" + VOWELS + "]{4}")]

var reverse = function(s) {
    // reverse a string
    return s.split('').reverse().join('');
};

var capitalizeFirstLetter = function(string) {
    // capitalise first letter of a string
    return string.charAt(0).toUpperCase() + string.slice(1);
};

var getWordsFromText = function(text) {
    // split a text into an array of words
    var words = text.split(" ");
    return(words);
};

var getWordsStartingWith = function(words, starting) {
    // get only the words that start with a certain string from an array of words
    words = words.filter(function (x) {return(x.startsWith(starting));});
    return(words);
};

var getWordsEndingWith = function(words, starting) {
    // get only the words that end with a certain string from an array of words
    words = words.filter(function (x) {return(x.endsWith(starting));});
    return(words);
};

var getWordsOfMinLength = function(words, min_length) {
    // get only the words of a certain minimum length from an array of words
    words = words.filter(function (x) {return(x.length >= min_length);});
    return(words);
};

var separateLetters = function(words) {
    // put a space between every letter of every word
    for (var i = 0; i < words.length; i++) {
        words[i] = words[i].split("").join(" ");
    };
    return(words);
};

var hasTooManyLettersInARow = function(
        word, letter_type, not_exceeding) {
    // does this word have too many letters of a
    // certain type in a row? E.g. too many
    // consonants in a row?
    how_many = 0
    for (var i = 0; i < word.length; i++) {
        if (letter_type.search(word[i]) != -1) {
            how_many = how_many + 1;
            if (how_many > not_exceeding) {
                return(true);
            };
        } else {
            how_many = 0;
        };
    };
    return(false);
};

function getUnique(value, index, self) { 
    // get unique values from an array
    return self.indexOf(value) === index;
};

var choice = function (a) {
    var i = Math.floor(a.length * Math.random());
    return a[i];
};

var make_name = function (min_length, gender) {
    var startletters = genders[gender]["startletters"];
    var letterstats = genders[gender]["letterstats"];
    var terminals = genders[gender]["terminals"];
    letter = choice(startletters);
    var name = [letter];
    while (letterstats.hasOwnProperty(letter)) {
        var next_letters = letterstats[letter];
        letter = choice(next_letters);
        name.push(letter);
        if (name.length > min_length &&
            terminals.hasOwnProperty(letter)) break;
    }
    name = name.join("");
    if (name.length < min_length ||
        BAD_COMBINATIONS.some(function (x) {return(x.test(name));})) {
            console.log("Bad combinations: " + name);
            return make_name(min_length, gender);};
    return capitalizeFirstLetter(name);
};


var texts = $.map($(".training-text"), function(x) {
    return(/([^/]+)(?=\.js)/.exec(x.src));}).filter(getUnique);
var text = $.map(texts, function(x) {return window[x];}).join(' ');
text = text.toLowerCase();

var words = getWordsFromText(text);
var genders = {"feminine": {"ending": "a"},
               "masculine": {"ending": "us"},
               "neuter": {"ending": "um"}}

for (var gender in genders) {
    var words_of_gender = getWordsOfMinLength(getWordsEndingWith(words, genders[gender]["ending"]), 4);
    words_of_gender = separateLetters(words_of_gender);
    var terminals = [];
    var startletters = [];
    var letterstats = [];

    for (var i = 0; i < words_of_gender.length; i++) {
        var letters = words_of_gender[i].split(' ');
        terminals[letters[letters.length-1]] = true;
        startletters.push(letters[0]);
        for (var j = 0; j < letters.length - 1; j++) {
            if (letterstats.hasOwnProperty(letters[j])) {
                letterstats[letters[j]].push(letters[j+1]);
            } else {
                letterstats[letters[j]] = [letters[j+1]];
            };
        };
    };
    genders[gender]["words"] = words_of_gender;
    genders[gender]["terminals"] = terminals;
    genders[gender]["startletters"] = startletters;
    genders[gender]["letterstats"] = letterstats;
};

var feminine_name = make_name(5 + Math.floor(3 * Math.random()), "feminine");
var masculine_name = make_name(5 + Math.floor(3 * Math.random()), "masculine");
var neuter_name = make_name(5 + Math.floor(3 * Math.random()), "neuter");

$("#feminine-name").text(feminine_name);
$("#masculine-name").text(masculine_name);
$("#neuter-name").text(neuter_name);
