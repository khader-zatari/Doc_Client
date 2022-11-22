import $ from 'jquery'
import { addUpdate, sendName } from './sockets';

let isDelete = false;




$(() => {

    var input = $('#main-doc');
    let isNameSaved = false;

    console.log("before");
    console.log(input.prop("selectionStart"));
    console.log(input.prop("selectionEnd"));
    let start;
    let end;
    let didIdelete = false;
    let nameIsSent = false;
    input.on('keydown', (event) => {
        if (!nameIsSent) {
            sendName($("#userInput").val());
            nameIsSent = true;
        }
        start = input.prop("selectionStart");
        end = input.prop("selectionEnd");
        var key = event.keyCode || event.charCode;
        if (key == 8 || key == 46) {
            console.log("in delelte and the start is", start - 1, " and the end is ", end - 1);
            if (start - 1 >= -1 && end - 1 >= 0) {
                console.log("in delete");
                if (start == end) {
                    addUpdate($('#userInput').val(), "DELETE", null, start - 1, end - 1);
                }
                else {
                    addUpdate($('#userInput').val(), "DELETE_RANGE", null, start - 1, end - 1);
                }
                didIdelete = true;
            }


        }

    });

    input.on("input", (event) => {
        console.log("in input and the didIdelete", didIdelete);
        if (!didIdelete) {
            console.log(didIdelete);
            console.log("iam adding and the start is ", start - 1, "and the end is ", end - 1);
            if (start == end) {
                addUpdate($('#userInput').val(), "APPEND", event.originalEvent.data, end, end);
            }
            else {
                addUpdate($('#userInput').val(), "APPEND_RANGE", event.originalEvent.data, start - 1, end - 1)
            }
        }
        didIdelete = false;
    })


})

const addViewingUser = (viewingUsers) => {

    let viewingUser = $("#viewingUsers");
    let user = $('#userInput').val();
    // viewingUsers.forEach((user, i) => viewingUser.html("<p>" + user + "</p>"));
    console.log(viewingUsers);
    // viewingUser.html("<p>" + viewingUser + "</p>")


}

const update = (updateData) => {
    let textArea = $('#main-doc');
    let user = $('#userInput').val();
    let start = textArea.prop("selectionStart");
    if (user != updateData.userName) {
        textArea.val(updateData.documentText);

        if (updateData.updateType == "APPEND") {

            if (updateData.startPosition < start) {
                start = start + (updateData.endPosition - updateData.startPosition + 1);
                console.log(start);
                console.log("the pointor is moved to " + start);
                textArea[0].setSelectionRange(start, start);
            } else {
                textArea[0].setSelectionRange(start, start);

            }
        }
        else if (updateData.updateType == "DELETE") {
            if (updateData.startPosition < start) {
                start = start - (updateData.endPosition - updateData.startPosition + 1);
                console.log(start);
                console.log("the pointor is moved to the left" + start);
                textArea[0].setSelectionRange(start, start);
            } else {
                textArea[0].setSelectionRange(start, start);

            }
        }
        else if (updateData.updateType == "DELETE_RANGE" || updateData.updateType == "APPEND_RANGE") {
            if (updateData.startPosition < start - 1 && updateData.endPosition < start - 1) {
                start = start - (updateData.endPosition - updateData.startPosition);
                console.log(start);
                console.log("the pointor is moved to the left" + start);
                textArea[0].setSelectionRange(start, start);
            } else if (updateData.startPosition < start - 1 && updateData.endPosition > start - 1) {
                start = start - (start - updateData.startPosition) + 1;
                console.log(start);
                console.log("the pointor is moved to the left" + start);
                textArea[0].setSelectionRange(start, start);
            }
            else {
                textArea[0].setSelectionRange(start, start);

            }

        }
    }
}

export { update, addViewingUser }


// $(() => {

//     var input = $('#main-doc');
//     let isNameSaved = false;
//     input.on('keydown', (event) => {
//         if (!isNameSaved) {
//             sendName($("#userInput").val());
//             isNameSaved = true;
//         }

//         var key = event.keyCode || event.charCode;
//         if (key == 8 || key == 46) {
//             isDelete = true;
//             console.log("iam deleteing");

//             // console.log("delete", input.prop("selectionStart"), input.prop("selectionEnd"));
//             let start = input.prop("selectionStart")
//             let end = input.prop("selectionEnd");
//             console.log("in delelte ", start, " ", end);
//             if (start > 0) {
//                 if (start == end) {

//                     addUpdate($('#userInput').val(), "DELETE", null, start - 1, end - 1)
//                 } else {
//                     addUpdate($('#userInput').val(), "DELETE_RANGE", null, start - 1, end - 1)
//                 }
//             }
//         }

//     });
//     input.on("input", (event) => {//append range not working 
//         if (!isDelete) {
//             let start = input.prop("selectionStart")
//             let end = input.prop("selectionEnd");
//             console.log("the start is ", start - 1, "and the end is ", end - 1);
//             // console.log("start is ", start, end);
//             if (start == end) {
//                 addUpdate($('#userInput').val(), "APPEND", event.originalEvent.data, end - 1, end - 1)
//             }
//             else {//append ragne not working. 
//                 // addUpdate($('#userInput').val(), "DELETE_RANGE", null, start - 1, end - 1)
//                 // addUpdate($('#userInput').val(), "APPEND_RANGE", event.originalEvent.data, start - 1, start - 1)
//             }

//         }
//         isDelete = false;
//     })
// })
// const addViewingUser = (newUser) => {
//     let viewingUser = $("#viewingUsers");
//     let user = $('#userInput').val();
//     viewingUser.append("<p>" + newUser.userName + "</p>");



// }
// const update = (updateData) => {
//     let textArea = $('#main-doc');
//     let user = $('#userInput').val();
//     let start = textArea.prop("selectionStart");
//     if (user != updateData.userName) {
//         textArea.val(updateData.documentText);
//         // let text = textArea.val();
//         // let newContent = updateData.content == null ? "" : updateData.content

//         // if (updateData.type == "APPEND") {
//         //     text = text.substring(0, updateData.startPosition) + newContent + text.substring(updateData.startPosition, text.length + newContent.length);
//         // }
//         // else if (updateData.type == "DELETE") {
//         //     text = text.substring(0, updateData.startPosition) + text.substring(updateData.startPosition + 1, text.length);
//         // }
//         // else if (updateData.type == "DELETE_RANGE") {
//         //     text = text.substring(0, updateData.startPosition + 1) + text.substring(updateData.startPosition + (updateData.endPosition - updateData.startPosition) + 1, text.length);
//         // }
//         // else if (updateData.type == "APPEND_RANGE") {
//         //     text = text.substring(0, updateData.startPosition + 1) + newContent + text.substring(updateData.endPosition + 1, text.length + newContent.length);
//         // }


//         //i think that this one needs change
//         if (updateData.position < start) {
//             start += updateData.content.length;
//             console.log(start);
//             textArea[0].setSelectionRange(start, start);
//         }
//     }
// }

// export { update, addViewingUser }