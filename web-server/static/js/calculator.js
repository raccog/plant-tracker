var xhr = new XMLHttpRequest();
var url = "get/nutrients.json";
var nutrient_schedule;

xhr.onreadystatechange = function() {
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

xhr.onreadystatechange = function() {
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

function updateReplaceSingle(value) {
    replaceSingle = value;
}

function postPlant() {
    if (split) {
        for (let id of current_plants) {
            var g;
            if (shareEle.value) {
                g = gal;
            } else {
                g = gal * percentageEles[id];
            }
            var data = {
                'id': id,
                'gal': g,
                'percent': percent,
                'week': week,
                'replace': replaceEles[id].value,
                'pHup': pHupEle.value,
                'pHdown': pHdownEle.value,
                'calmag': calmag
            };
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/post/post_record", true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(data));
        }
    } else {
        var data = {
            "id": postPlantEle.value,
            "gal": gal,
            "percent": percent,
            "week": week,
            "replace": replaceSingleEle.value,
            "pHup": pHupEle.value,
            "pHdown": pHdownEle.value,
            "calmag": calmag
        };
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/post/post_record", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
    }
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
