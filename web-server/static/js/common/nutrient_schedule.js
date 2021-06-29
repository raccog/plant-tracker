// Data recieved from server
let nutrient_schedule;

// Callback
function parseNutrientSchedule(responseText) {
    nutrient_schedule = tryParseJSON(responseText);
}

// GET request
function getNutrientSchedule(callback) {
    getRequest('/get/nutrients.json', combineCallbacks(parseNutrientSchedule, callback), retrieveErrorMsg('nutrient schedule'));
}