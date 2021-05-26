var xmlhttp = new XMLHttpRequest();
var url = "nutrients.json";
var data;

xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        data = JSON.parse(this.responseText)[0];
        updateCalculation();
    }
};
xmlhttp.open("GET", url, true);
xmlhttp.send();

var errorEle = document.getElementById('error');
var weekEle = document.getElementById('week');
var percentEle = document.getElementById('percent');
var galEle = document.getElementById('gal');
var calmgEle = document.getElementById('calmg?');

var week = weekEle.value;
var percent = parseInt(percentEle.value) / 100.0;
var gal = parseInt(galEle.value);
var calmg = calmgEle.value;

const labels = ['micro', 'veg', 'bloom', 'guard', 'calmg'];
var outputEles = [];
for (var i = 0; i < labels.length; ++i) {
    outputEles[i] = document.getElementById(labels[i]);
}

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

function updateCalmg(value) {
    calmg = value;
    updateCalculation();
}

function add_ml(value) {
    return value.toString() + 'ml';
}

function updateCalculation() {
    if (data[week] == null) {
        errorEle.textContent = 'Week error';
    } else {
        errorEle.textContent = '';
        var calc = data[week].slice();
        for (var i = 0; i < calc.length; ++i) {
            calc[i] *= percent * gal;
        }
        for (var i = 0; i < 3; ++i) {
            outputEles[i].textContent = add_ml(calc[i]);
        }
        outputEles[3].textContent = add_ml(gal * 2);
        outputEles[4].textContent = add_ml(calmg ? calc[3] : 0);
    }
}
