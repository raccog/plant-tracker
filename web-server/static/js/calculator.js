var xhr = new XMLHttpRequest();
var url = "get/nutrients.json";
var nutrient_schedule;

xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        nutrient_schedule = JSON.parse(this.responseText)[0];
        updateCalculation();
    }
};
xhr.open("GET", url, true);
xhr.send();

xhr = new XMLHttpRequest();
url = "get/current.json";
var current_plants;
var percentageEles = {};
var replaceEles = {};

xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        current_plants = JSON.parse(this.responseText);
        for (var i = 0; i < current_plants.length; ++i) {
            var id = current_plants[i];
            percentageEles[id] = document.getElementById('percentage-' + id);
            replaceEles[id] = document.getElementById('replace-' + id);
        }
    }
}
xhr.open("GET", url, true);
xhr.send();

var postErrorEle = document.getElementById('msg');
var errorEle = document.getElementById('error');
var weekEle = document.getElementById('week');
var percentEle = document.getElementById('percent');
var galEle = document.getElementById('gal');
var calmagEle = document.getElementById('calmag?');

var pHupEle = document.getElementById('pHup');
var pHdownEle = document.getElementById('pHdown');
var postPlantEle = document.getElementById('postPlant');
var replaceSingleEle = document.getElementById('replaceSingle');
var shareEle = document.getElementById('share');

var splitEle = document.getElementById('split');
var shareEle = document.getElementById('share');

var onSplitEles = document.querySelectorAll(".onSplit");
var onNoSplitEles = document.querySelectorAll(".onNoSplit");

var week = weekEle.value;
var percent = parseInt(percentEle.value) / 100.0;
var gal = parseInt(galEle.value);
var calmag = calmagEle.value;

var split = true;
var share = false;
var replaceSingle = false;

const labels = ['micro', 'veg', 'bloom', 'guard', 'calmag'];
var outputEles = [];
for (var i = 0; i < labels.length; ++i) {
    outputEles[i] = document.getElementById(labels[i]);
}

updateVisibility();

function updateWeek(value) {
    week = value;
    updateCalculation();
}

function updatePercent(value) {
    percent = parseInt(value) / 100.0;
    updateCalculation();
}

function updateGal(value) {
    gal = parseInt(value);
    updateCalculation();
}

function updatecalmag(value) {
    calmag = value;
    updateCalculation();
}

function updateSplit(value) {
    split = value;
    updateVisibility();
}

function updateShare(value) {
    share = value;
}

function updateReplaceSingle(value) {
    replaceSingle = value;
}

function add_ml(value) {
    return value.toString() + 'ml';
}

function updateCalculation() {
    if (nutrient_schedule[week] == null) {
        errorEle.textContent = 'Week error';
    } else {
        errorEle.textContent = '';
        var calc = nutrient_schedule[week].slice();
        for (var i = 0; i < calc.length; ++i) {
            calc[i] *= (percent * gal).toFixed(3);
        }
        for (var i = 0; i < 3; ++i) {
            outputEles[i].textContent = add_ml(calc[i]);
        }
        outputEles[3].textContent = add_ml(gal * 2);
        outputEles[4].textContent = add_ml(calmag ? calc[3] : 0);
    }
}

function updateVisibility() {
    for (let ele of onSplitEles) {
        if (split) {
            ele.style.visibility = 'hidden';
        } else {
            ele.style.visibility = 'visible';
        }
    }
    for (let ele of onNoSplitEles) {
        if (!split) {
            ele.style.visibility = 'hidden';
        } else {
            ele.style.visibility = 'visible';
        }
    }
}

function postData(data) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/post/new_record", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}

function postPlant() {
    var data;
    if (split) {
        for (let id of current_plants) {
            var g = gal;
            var up = pHupEle.value;
            var down = pHdownEle.value;
            if (!share) {
                var p = percentageEles[id].value * 0.01;
                g *= p;
                up *= p;
                down *= p;
            }

            data = {
                'id': id,
                'gal': g,
                'percent': percent,
                'week': week,
                'replace': replaceEles[id].value,
                'pHup': up,
                'pHdown': down,
                'calmag': calmag
            };
        }
    } else {
        data = {
            "id": postPlantEle.value,
            "gal": gal,
            "percent": percent,
            "week": week,
            "replace": replaceSingleEle.value,
            "pHup": pHupEle.value,
            "pHdown": pHdownEle.value,
            "calmag": calmag
        };
    }

    if (confirm('Do you want to post this record to nid' + (split ? 's' : '')
        + ': ' + (split ? current_plants.toString() : data['id']) +
        '?\nData:\n\nWeek: ' + data['week'] + '\nGallons: ' + data['gal'] +
        'gal\nPercentage: ' + (data['percent'] * 100) + '\%\nReplace: ' + data['replace'] +
        '\npH Up: ' + data['pHup'] + 'mL\npH Down: ' + data['pHdown'] +
        'mL\nCalMag: ' + data['calmag'])) {
            postData(data);
            postErrorEle.style.color = 'green';
            postErrorEle.textContent = 'Record was successfully posted'
    } else {
        postErrorEle.style.color = 'red';
        postErrorEle.textContent = 'Posting this record was cancelled'
    }
}
