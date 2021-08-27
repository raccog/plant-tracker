// Data recieved from server
let plant_events = {};

// Callback
function parseEventsCallbackGenerator(id) {
    return function (responseText) {
        plant_events[id] = tryParseJSON(responseText);
    };

}

// GET request
function getPlantEvents(id, callback) {
    getRequest('/get/events_' + id + '.json', combineCallbacks(parseEventsCallbackGenerator(id), callback), retrieveErrorMsg('plant with id (' + id + ')'));
}
