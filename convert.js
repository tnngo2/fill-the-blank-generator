function rmBreakLineCollocation(str){
    return str.replace(/\n\(#/g, '(#');
}

function doConvert(json) {
    var output = '';
    json.forEach(function (item) {
        var question = item.question;
        var answer = item.answer;
        if (answer && question) {
            var explaination = answer.match(/(\(=(\w|\s)*\))/g);
            var collocations = answer.match(/\(#(\w|\s|~|\/)*\)/g);
            var hints = explaination.concat(collocations);

            var answerHintReplaced = answer.replace(/(\(=.*?\))/g, function () {
                return '@';
            });

            var answerNotedRemoved = answerHintReplaced.replace(/(\(.*?\))/g, function () {
                return '';
            });

            var wordList = answerNotedRemoved.split(' ');
            var foundIdx;
            wordList.forEach(function (word, idx, list) {
                if (word) {
                    if (list[idx + 1] === '@' && hints) {
                        foundIdx = question.search(word);
                        if (foundIdx !== -1) {
                            question = question.splice(foundIdx + word.length, 0, ' ' + hints.join(''));
                        }
                    }
                    var pattern = new RegExp('(^|\\W)' + word + '(\\W|$)');

                    question = question.replace(pattern, ' ___ ');
                }
            });
            console.log(question + '\t' + answer);
            output = output + question + '\t' + answer + '\n';
        }
    });
    return output;
}

function cleanInput(input) {
    var inputWithCollocation = rmBreakLineCollocation(input);

    var pairs = inputWithCollocation.replace(/(.*)\n(.*)\n/g, '$1\t$2\n');
    console.log(pairs);
    pairs = 'question\tanswer\n' + pairs;
    return pairs;
}

//var csv is the CSV file with headers
function csvJSON(csv) {

    var lines = csv.split("\n");
    var result = [];
    var headers = lines[0].split("\t");

    for (var i = 1; i < lines.length; i++) {

        var obj = {};
        var currentline = lines[i].split("\t");

        for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }

        result.push(obj);
    }

    //return result; //JavaScript object
    return JSON.stringify(result); //JSON
}

document.getElementById('clean').addEventListener('click', function () {
    var input = document.getElementById('inputTxt').value;
    var output = cleanInput(input + '\n');
    document.getElementById('cleanedTxt').value = output;
});

document.getElementById('csvToJson').addEventListener('click', function () {
    var input = document.getElementById('cleanedTxt').value;
    var output = csvJSON(input);
    document.getElementById('jsonTxt').value = output;
});

document.getElementById('convert').addEventListener('click', function () {
    var input = document.getElementById('jsonTxt').value;
    var output = doConvert(JSON.parse(input));
    document.getElementById('outputTxt').value = output;
});


document.getElementById('copy').addEventListener('click', function () {
    var input = document.getElementById('outputTxt');
    input.focus();
    input.select();
    document.execCommand('copy');
})

String.prototype.splice = function (idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};
