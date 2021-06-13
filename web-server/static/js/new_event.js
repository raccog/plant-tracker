var eventText = document.getElementById("event");
var checkboxes = document.getElementsByClassName("check");

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
    
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/post/new_event", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}