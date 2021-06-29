// Data recieved from server
let current_plants;

// Callback
function parseCurrentPlants(responseText) {
    current_plants = tryParseJSON(responseText);
}

// GET request
function getCurrentPlants(callback) {
    getRequest('/get/current.json', combineCallbacks(parseCurrentPlants, callback), retrieveErrorMsg('current plants'));
}