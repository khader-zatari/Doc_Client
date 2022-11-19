import $ from 'jquery'
import { addUpdate } from './sockets';


$(() => {

    var input = $('#main-doc');

    input.on('keydown', (event) => {
        var key = event.keyCode || event.charCode;
        if (key == 8 || key == 46) {
            // console.log("deleting: " + input.val().substring(input.prop("selectionStart"), input.prop("selectionEnd")));
            // console.log(input.prop("selectionStart"), input.prop("selectionEnd"));
            console.log("delete", input.prop("selectionStart"), input.prop("selectionEnd"));
            addUpdate($('#userInput').val(), "DELETE", null, input.prop("selectionStart") - 1, input.prop("selectionEnd") - 1)
        }

    });
    input.on("input", (event) => {
        let start = input.prop("selectionStart")
        let end = input.prop("selectionEnd");
        // console.log("start is ", start, end);
        if (start == end) {
            addUpdate($('#userInput').val(), "APPEND", event.originalEvent.data, end - 1, end - 1)
        }

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


        textArea.val(text);
        if (updateData.position < start) {
            start += updateData.position;
            textArea[0].setSelectionRange(start, start);
        }
    }
}

export { update }