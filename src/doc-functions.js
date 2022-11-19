import $ from 'jquery'
import { addUpdate } from './sockets';


$(() => {

    var input = $('#main-doc');

    input.on('keydown', (event) => {
        var key = event.keyCode || event.charCode;
        if (key == 8 || key == 46) {

            // console.log("delete", input.prop("selectionStart"), input.prop("selectionEnd"));
            let start = input.prop("selectionStart")
            let end = input.prop("selectionEnd");
            if (start == end) {
                addUpdate($('#userInput').val(), "DELETE", null, start - 1, end - 1)
            } else {
                addUpdate($('#userInput').val(), "DELETE_RANGE", null, start - 1, end - 1)
            }

        }

    });
    input.on("input", (event) => {//append range not working 
        let start = input.prop("selectionStart")
        let end = input.prop("selectionEnd");
        // console.log("start is ", start, end);
        if (start == end) {
            addUpdate($('#userInput').val(), "APPEND", event.originalEvent.data, end - 1, end - 1)
        }
        // else {
        //     addUpdate($('#userInput').val(), "APPEND_RANGE", event.originalEvent.data, start - 1, end - 1)
        // }

    })
})

const update = (updateData) => {
    let textArea = $('#main-doc');
    let user = $('#userInput').val();
    let start = textArea.prop("selectionStart");
    if (user != updateData.user) {
        let text = textArea.val();
        let newContent = updateData.content == null ? "" : updateData.content

        if (updateData.type == "APPEND") {
            text = text.substring(0, updateData.startPosition) + newContent + text.substring(updateData.startPosition, text.length + newContent.length);
        }
        else if (updateData.type == "DELETE") {
            text = text.substring(0, updateData.startPosition) + text.substring(updateData.startPosition + 1, text.length);
        }
        else if (updateData.type == "DELETE_RANGE") {
            text = text.substring(0, updateData.startPosition + 1) + text.substring(updateData.startPosition + (updateData.endPosition - updateData.startPosition) + 1, text.length);
        }
        // else if (updateData.type == "APPEND_RANGE") {
        //     text = text.substring(0, updateData.startPosition + 1) + newContent + text.substring(updateData.endPosition + 1, text.length + newContent.length);
        // }

        textArea.val(text);
        //i think that this one needs change
        if (updateData.position < start) {
            start += updateData.content.length;
            console.log(start);
            textArea[0].setSelectionRange(start, start);
        }
    }
}

export { update }