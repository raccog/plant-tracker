// DOM elements
// Inputs
const inpPercentages = {};
const inpWeek = document.getElementById('week');
const inpPercent = document.getElementById('percent');
const inpGal = document.getElementById('gal');
const inpphUp = document.getElementById('pHup');
const inpphDown = document.getElementById('pHdown');
const inpPlant = document.getElementById('plant');
// Checkboxes
const checkReplaces = {};
const checkSplit = document.getElementById('split');
const checkShare = document.getElementById('share');
const checkReplaceSingle = document.getElementById('replaceSingle');
const checkReplaceShare = document.getElementById('replaceShare');
const checkCalmag = document.getElementById('calmag?');
// Text
const textOutputs = {};
// Groups for visibility
const allOnSplit = document.querySelectorAll(".onSplit");
const allOnNoSplit = document.querySelectorAll(".onNoSplit");
const allOnShare = document.querySelectorAll(".onShare");
const allOnNoShare = document.querySelectorAll(".onNoShare");

// Page state
let split = checkSplit.checked;
let share = checkShare.checked;
let replaceSingle = checkReplaceSingle.checked;
let replaceShare = checkReplaceShare.checked;
let week = inpWeek.value;
let percent = parseInt(inpPercent.value);
let gal = parseInt(inpGal.value);
let calmag = checkCalmag.checked;

// Callbacks
function findCurrentElements() {
    for (let id of current_plants) {
        inpPercentages[id] = document.getElementById('percentage-' + id);
        checkReplaces[id] = document.getElementById('replace-' + id);
    }
}

function updateWeek(value) {
    week = value;
    calculate();
}

function updatePercent(value) {
    percent = parseInt(value);
    calculate();
}

function updateGal(value) {
    gal = parseInt(value);
    calculate();
}

function updatecalmag(value) {
    calmag = value;
    calculate();
}

function updateSplit(value) {
    split = value;
    if (!split) {
        share = false;
        checkShare.checked = false;
    }
    splitVisibility();
}

function updateShare(value) {
    share = value;
    shareVisibility();
}

function updateReplaceSingle(value) {
    replaceSingle = value;
}

function updateShareReplace(value) {
    replaceShare = value;
}

// Get requests
getNutrientSchedule(_ => calculate());
getCurrentPlants(_ => findCurrentElements());

// Setup
const labels = ['micro', 'veg', 'bloom', 'guard', 'calmag'];
for (let label of labels) {
    textOutputs[label] = document.getElementById(label);
}
splitVisibility();
shareVisibility();

// Page functions
function shareVisibility() {
    for (let ele of allOnShare) {
        ele.style.visibility = visibilityChange(share);
    }
    for (let ele of allOnNoShare) {
        ele.style.visibility = visibilityChange(!share);
    }
}

function splitVisibility() {
    for (let ele of allOnSplit) {
        ele.style.visibility = visibilityChange(!split);
    }
    for (let ele of allOnNoSplit) {
        ele.style.visibility = visibilityChange(split);
    }
}

function add_ml(value) {
    return value.toString() + 'ml';
}

function calculate() {
    if (nutrient_schedule == null) return;

    const calc = nutrient_schedule[week].slice();
    if (calc.length != 4) {
        restError('Nutrient schedule for week ' + week + ' is invalid: ' + calc.toString())
        for (let ele of textOutputs) {
            ele.textContent = 'Null';
        }
        return;
    }

    // Multiply by gallons and percent
    for (var i = 0; i < calc.length; ++i) {
        calc[i] *= (percent * gal / 100.0).toFixed(3);
    }
    // Output calculation to user
    for (let i = 0; i < 3; ++i) {
        textOutputs[labels[i]].textContent = add_ml(calc[i]);
    }
    textOutputs[labels[3]].textContent = add_ml(gal * 2);
    textOutputs[labels[4]].textContent = add_ml(calmag ? calc[3] : 0);
}

function postRecord(data) {
    postRequest('/post/new_record', data, 'Record was posted to database', 'Submitting a record returned an error');
}

function postPlant() {
    let data;
    if (split) {
        data = [];
        for (let id of current_plants) {
            let g = gal;
            let up = inpphUp.value;
            let down = inpphDown.value;
            let r = replaceShare;
            if (!share) {
                const p = inpPercentages[id].value * 0.01;
                g = (g * p).toPrecision(3);
                up = (up * p).toPrecision(3);
                down = (down * p).toPrecision(3);
                r = checkReplaces[id].checked;
            }

            data.push({
                'id': id,
                'gal': g,
                'percent': percent,
                'week': week,
                'replace': r,
                'pHup': up,
                'pHdown': down,
                'calmag': calmag
            });
        }
    } else {
        data = {
            "id": inpPlant.value,
            "gal": gal,
            "percent": percent,
            "week": week,
            "replace": checkReplaceSingle.checked,
            "pHup": inpphUp.value,
            "pHdown": inpphDown.value,
            "calmag": calmag
        };
    }

    var confirmMsg = 'Do you want to post this record to nid' + (split ? 's' : '') + ": " + (split ? current_plants.toString() : data['id']) + '?';
    if (Array.isArray(data)) {
        for (let d of data) {
            confirmMsg += '\n' + d['id'] + ':\n\nWeek: ' + d['week'] + '\nGallons: ' + d['gal'] +
                'gal\nPercentage: ' + d['percent'] + '\%\nReplace: ' + d['replace'] +
                '\npH Up: ' + d['pHup'] + 'mL\npH Down: ' + d['pHdown'] +
                'mL\nCalMag: ' + d['calmag'] + '\n\n';
        }
    } else {
        confirmMsg += '\n\nWeek: ' + data['week'] + '\nGallons: ' + data['gal'] + 'gal\nPercentage: ' + data['percent'] + '\%\nReplace: ' + data['replace'] + '\npH Up: ' + data['pHup'] + 'mL\npH Down: ' + data['pHdown'] + 'mL\nCalMag: ' + data['calmag'];
    }
    if (confirm(confirmMsg)) {
        if (Array.isArray(data)) {
            for (let d of data) {
                postRecord(d);
            }
        } else {
            postRecord(data);
        }
        restSuccess('Record was sent to database');
    } else {
        restError('Posting this record was cancelled');
    }
}
