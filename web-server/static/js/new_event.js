var eventText = document.getElementById("event");
var checkboxes = document.getElementsByClassName("check");
var msg = document.getElementById("msg");

function postEvent(data) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/post/new_event", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}

function onSubmit() {
    var text = eventText.value;
    var data = {
        "text": text,
        "nids": []
    };
    for (var box of checkboxes) {
        if (box.checked) {
            data['nids'].push(box.id);
        }
    }

    // confirm event posting
    if (confirm('Do you want to submit this event to nids: ' 
            + data['nids'].toString() + ',\n\n' + data['text'])) {
        postEvent(data);
        msg.style.color = 'green';
        msg.textContent = 'Event was posted to nids: ' + data['nids'].toString();
    } else {
        msg.style.color = 'red';
        msg.textContent = 'Event was not posted'
    }
}