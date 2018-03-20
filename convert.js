function doConvert(json) {
    json.forEach(function (item) {
        var question = item.FIELD1;
        var answer = item.FIELD2;
        if (answer !== '') {
            var hints = answer.match(/(\(=.*\))/g);
            var answerHintReplaced = answer.replace(/(\(=.*?\))/g, function () {
                return '@';
            });

            var answerNotedRemoved = answerHintReplaced.replace(/(\(.*?\))/g, function () {
                return '';
            });

            var answerColonRemoved = answerNotedRemoved.replace(',','');

            var wordList = answerColonRemoved.split(' ');
            var hintIdx=0;
            var foundIdx;
            wordList.forEach(function (word, idx, list) {
                if (word) {
                    if (list[idx+1] === '@' && hints) {
                        foundIdx = question.search(word);
                        if (foundIdx !== -1) {
                            question = question.splice(foundIdx + word.length, 0,  ' ' + hints[hintIdx]);
                            hintIdx++;
                        }
                    }
                    var pattern = new RegExp( '(\\A|\\W)' + word + '(\\W|$)');

                    question = question.replace(pattern, ' ___ ');
                }
            });
            console.log(question + ':' + answer);
        }
    });
}

String.prototype.splice = function(idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};
