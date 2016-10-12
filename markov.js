var reverse = function(s) {
  return s.split('').reverse().join('');
};

var capitalizeFirstLetter = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

var getWordsFromText = function(text) {
    var words = reverse(text).split(" ");
    return(words);
};

var getWordsStartingWith = function(words, starting) {
    words = words.filter(function (x) {return(x.startsWith(starting));});
    return(words);
};

var separateLetters = function(words) {
    for (var i = 0; i < words.length; i++) {
        words[i] = words[i].split("").join(" ");
    };
    return(words);
};

var text = [
    "in principio erat Verbum et Verbum erat apud Deum et Deus erat Verbum",
    "hoc erat in principio apud Deum",
    "omnia per ipsum facta sunt et sine ipso factum est nihil quod factum est",
    "in ipso vita erat et vita erat lux hominum",
    "et lux in tenebris lucet et tenebrae eam non conprehenderunt",
    "fuit homo missus a Deo cui nomen erat Iohannes",
    "hic venit in testimonium ut testimonium perhiberet de lumine ut omnes crederent per illum",
    "non erat ille lux sed ut testimonium perhiberet de lumine",
    "erat lux vera quae inluminat omnem hominem venientem in mundum",
    "in mundo erat et mundus per ipsum factus est et mundus eum non cognovit",
    "in propria venit et sui eum non receperunt",
    "quotquot autem receperunt eum dedit eis potestatem filios Dei fieri his qui credunt in nomine eius",
    "qui non ex sanguinibus neque ex voluntate carnis neque ex voluntate viri sed ex Deo nati sunt",
    "et Verbum caro factum est et habitavit in nobis et vidimus gloriam eius gloriam quasi unigeniti a Patre plenum gratiae et veritatis"];
text = text.join(" ").toLowerCase();

var words = getWordsFromText(text);
var endings = {"feminine": "a", "masculine": "um", "neuter": "um"};
var gender_words = {};
for (var key in endings) {
    var words_of_gender = getWordsStartingWith(words, endings[key]);
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
    word = choice(startletters);
    var name = [word];
    while (letterstats.hasOwnProperty(word)) {
        var next_letters = letterstats[word];
        word = choice(next_letters);
        name.push(word);
        if (name.length > min_length && terminals.hasOwnProperty(word)) break;
    }
    if (name.length < min_length) return make_name(min_length);
    return capitalizeFirstLetter(reverse(name.join('')));
};

var name = make_name(5 + Math.floor(3 * Math.random()));

$("#name-goes-here").text(name);
