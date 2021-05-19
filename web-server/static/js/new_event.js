const inpEvent = document.getElementById("event");
const allCheckboxes = document.getElementsByClassName("check");

function postEvent(data) {
    postRequest('/post/new_event', data, 'Event was posted to nid' + (data.length > 1 ? 's' : '') + ': ' + data['nids'].toString(), 'Submitting an event returned an error');
}

function onSubmit() {
    const text = inpEvent.value;
    const data = {
        "text": text,
        "nids": []
    };
    for (let box of allCheckboxes) {
        if (box.checked) {
            data['nids'].push(box.id);
        }
    }
    if (data['nids'].length == 0) {
        restError('At least one plant needs to be checked');
        return;
    }
    if (text == "") {
        restError('Cannot submit an empty event');
        return;
    }

    // confirm event posting
    if (confirm('Do you want to submit this event to nid' + (data['nids'].length > 1 ? 's' : '') + ': ' 
            + data['nids'].toString() + ',\n\n' + data['text'])) {
        postEvent(data);
        restSuccess('Event was sent to database');
    } else {
        restError('Event was cancelled');
    }
}