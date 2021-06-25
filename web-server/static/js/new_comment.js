const inpComment = document.getElementById("comment");
const allCheckboxes = document.getElementsByClassName("check");

function postEvent(data) {
    postRequest('/post/new_comment', data, 'Comment was posted to nid' + (data.length > 1 ? 's' : '') + ': ' + data['nids'].toString(), 'Submitting a comment returned an error');
}

function onSubmit() {
    const text = inpComment.value;
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
    if (confirm('Do you want to submit this comment to nid' + (data['nids'].length > 1 ? 's' : '') + ': ' + data['nids'].toString() + ',\n\n' + data['text'])) {
        postEvent(data);
        restSuccess('Comment was sent to database');
    } else {
        restError('Comment was cancelled');
    }
}