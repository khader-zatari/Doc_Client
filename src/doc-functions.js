import $ from "jquery";
import { getDocument } from "./rest";
import { addUpdate, sendName } from "./sockets";

let isDelete = false;
const startEditingDoc = (docId) => {
  getDocument(docId)
    .then((data) => {
      console.log("data is", data);
      $("#doc-id").text(docId);
      // $("#doc-title").text("put title here");
      // $("#doc-last-editede").text("put last edited here");
      $("#main-doc-content").text(data);
      //input.val = data;
      let start;
      let end;
      let didIdelete = false;
      let nameIsSent = false;
      input.on("keydown", (event) => {
        if (!nameIsSent) {
          sendName($("#userInput").val());
          nameIsSent = true;
        }
        start = input.prop("selectionStart");
        end = input.prop("selectionEnd");
        var key = event.keyCode || event.charCode;
        if (key == 8 || key == 46) {
          if (start - 1 >= -1 && end - 1 >= 0) {
            console.log("in delete");
            if (start == end) {
              addUpdate(
                $("#userInput").val(),
                "DELETE",
                null,
                start - 1,
                end - 1
              );
            } else {
              addUpdate(
                $("#userInput").val(),
                "DELETE_RANGE",
                null,
                start - 1,
                end - 1
              );
            }
            didIdelete = true;
          }
        }
      });

      input.on("input", (event) => {
        if (!didIdelete) {
          console.log(didIdelete);
          if (start == end) {
            addUpdate(
              $("#userInput").val(),
              "APPEND",
              event.originalEvent.data,
              end,
              end
            );
          } else {
            addUpdate(
              $("#userInput").val(),
              "APPEND_RANGE",
              event.originalEvent.data,
              start - 1,
              end - 1
            );
          }
        }
        didIdelete = false;
      });
    })
    .catch((err) => console.log(err));
};
// $(() => {
//   var input = $("#main-doc");
//   let docContent = getDocument(4);

//   input.val(docContent);
//   let isNameSaved = false;

//   console.log("before");
//   console.log(input.prop("selectionStart"));
//   console.log(input.prop("selectionEnd"));
//   let start;
//   let end;
//   let didIdelete = false;
//   let nameIsSent = false;
//   input.on("keydown", (event) => {
//     if (!nameIsSent) {
//       sendName($("#userInput").val());
//       nameIsSent = true;
//     }
//     start = input.prop("selectionStart");
//     end = input.prop("selectionEnd");
//     var key = event.keyCode || event.charCode;
//     if (key == 8 || key == 46) {
//       console.log(
//         "in delelte and the start is",
//         start - 1,
//         " and the end is ",
//         end - 1
//       );
//       if (start - 1 >= -1 && end - 1 >= 0) {
//         console.log("in delete");
//         if (start == end) {
//           addUpdate($("#userInput").val(), "DELETE", null, start - 1, end - 1);
//         } else {
//           addUpdate(
//             $("#userInput").val(),
//             "DELETE_RANGE",
//             null,
//             start - 1,
//             end - 1
//           );
//         }
//         didIdelete = true;
//       }
//     }
//   });

//   input.on("input", (event) => {
//     console.log("in input and the didIdelete", didIdelete);
//     if (!didIdelete) {
//       console.log(didIdelete);
//       console.log(
//         "iam adding and the start is ",
//         start - 1,
//         "and the end is ",
//         end - 1
//       );
//       if (start == end) {
//         addUpdate(
//           $("#userInput").val(),
//           "APPEND",
//           event.originalEvent.data,
//           end,
//           end
//         );
//       } else {
//         addUpdate(
//           $("#userInput").val(),
//           "APPEND_RANGE",
//           event.originalEvent.data,
//           start - 1,
//           end - 1
//         );
//       }
//     }
//     didIdelete = false;
//   });
// });

const addViewingUser = (viewingUsers) => {
  let viewingUser = $("#viewingUsers");
  let thisUser = $("#userInput").val();
  viewingUsers
    .filter((user) => user != thisUser)
    .forEach((user, i) => viewingUser.html("<p>" + user + "</p>"));
  console.log(viewingUsers);
};

const update = (updateData) => {
  let textArea = $("#main-doc");
  let user = $("#userInput").val();
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
    } else if (updateData.updateType == "DELETE") {
      if (updateData.startPosition < start) {
        start = start - (updateData.endPosition - updateData.startPosition + 1);
        console.log(start);
        console.log("the pointor is moved to the left" + start);
        textArea[0].setSelectionRange(start, start);
      } else {
        textArea[0].setSelectionRange(start, start);
      }
    } else if (
      updateData.updateType == "DELETE_RANGE" ||
      updateData.updateType == "APPEND_RANGE"
    ) {
      if (
        updateData.startPosition < start - 1 &&
        updateData.endPosition < start - 1
      ) {
        start = start - (updateData.endPosition - updateData.startPosition);
        console.log(start);
        console.log("the pointor is moved to the left" + start);
        textArea[0].setSelectionRange(start, start);
      } else if (
        updateData.startPosition < start - 1 &&
        updateData.endPosition > start - 1
      ) {
        start = start - (start - updateData.startPosition) + 1;
        console.log(start);
        console.log("the pointor is moved to the left" + start);
        textArea[0].setSelectionRange(start, start);
      } else {
        textArea[0].setSelectionRange(start, start);
      }
    }
  }
};

export { update, addViewingUser, startEditingDoc };
