function makeTextFile(textFile, text) {
  var data = new Blob([text], {type: 'text/plain'});

  if (textFile !== null) {
    window.URL.revokeObjectURL(textFile);
  }

  textFile = window.URL.createObjectURL(data);

  return textFile;
};

function makeCSV(values) {
    var finalVal = '';

    for (var j = 0; j < values.length; j++) {
        var innerValue =  values[j]===null?'':''+values[j];
        var result = innerValue.replace(/"/g, '""');
        if (result.search(/("|,|\n)/g) >= 0)
            result = '"' + result + '"';
        if (j > 0)
            finalVal += ',';
        finalVal += result;
    }
    return finalVal;
}

function Biologger(params, userid, sesskey, enrollURL, flushDelay) {
    console.log("Biologger init");

    var that = this; // Used in several closures below

    this.buffer = [['date_time','performance_time']];

    this.startLogging = function() {
        console.log("Start logging");

        setTimeout(that.capture, 100);
    };

    this.stopLogging = function() {
        console.log("Stop logging");

        for (e in this.events) {
            removeEvent(
                window,
                e,
                that.events[e]
            );
        };
    };

    this.addEvent = function(e) {
        that.buffer.push(e);
    };

    this.getEvents = function() {
        return that.buffer.map(makeCSV).join("\n");
    };

    this.capture = function() {
        that.addEvent([Date.now(), performance.now()]);

        setTimeout(that.capture, 10*Math.random());
    };
};


(function () {
    var b = new Biologger();
    b.startLogging();

    var textFile = null;
    var save = document.getElementById('save');

    save.addEventListener('click', function () {
      var link = document.createElement('a');
      link.setAttribute('download', performance.timeOrigin + '.csv');
      link.href = makeTextFile(textFile, b.getEvents());
      document.body.appendChild(link);

      // wait for the link to be added to the document
      window.requestAnimationFrame(function () {
        var event = new MouseEvent('click');
        link.dispatchEvent(event);
        document.body.removeChild(link);
  		});

    }, false);
})();
