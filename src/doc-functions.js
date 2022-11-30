import $ from "jquery";
import { getDocument, changeUserRole } from "./rest";
import { addUpdate, sendName } from "./sockets";

let isDelete = false;
const startEditingDoc = (docId) => {
  getDocument(docId) //TODO: pass parameter userId
    .then((data) => {
      console.log("doc data", data);
      $("#doc-id").text(data.id);
      $("#doc-title").text(data.name);
      $("#doc-last-edited").text(data.lastEdited);
      $("#main-doc-content").text(data.content);
      let input = $("#main-doc-content");
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
  let textArea = $("#main-doc-content");
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

const initExport = () => {
  let exportBtn = $("#exportBtn");

  exportBtn.on("click", (event) => {
    let text = $("#main-doc-content").val();
    let filename = $("#doc-title").text();
    download(filename, text);
  });
};

const download = (filename, text) => {
  let element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

const initEditRoleForm = (id) => {
  $("#changeRoleBtn").on("click", function (event) {
    event.preventDefault();
    const roleForm = {
      ownerId: 2, //CHANGE HARD CODED USER
      docId: id,
      email: $("#email").val().toLowerCase(),
      role: $("#roles").find(":selected").val().toUpperCase(),
    };
    console.log(roleForm);
    changeUserRole(roleForm);
  });
};

export {
  update,
  addViewingUser,
  startEditingDoc,
  initExport,
  initEditRoleForm,
};
