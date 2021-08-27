// Data recieved from server
const nutrient_data = {};

// Callback
function parseNutrientDataCallbackGenerator(id) {
    return function (responseText) {
        nutrient_data[id] = tryParseJSON(responseText);
    };
}

// GET request
function getNutrientData(id, callback) {
    getRequest('/get/nutrient_' + id + '.json', combineCallbacks(parseNutrientDataCallbackGenerator(id), callback), retrieveErrorMsg('plant with id (' + id + ')'));
}

function checkCurrentAndSchedule(callback) {
    if (nutrient_schedule != null && current_plants != null) {
        callback();
    }
}
