import $ from "jquery";
import { getDocument, changeUserRole } from "./rest";
import { addUpdate, removeUser, sendName } from "./sockets";

let isDelete = false;
const startEditingDoc = (docId, userId, userRole) => {
  //delete user id( it's in local storage)
  getDocument(docId)
    .then((response) => {
      if (response.success) {
        console.log("doc data", response.data);
        sendName(localStorage.getItem("userName"));
        $("#doc-id").text(response.data.id);
        $("#doc-title").text(response.data.name);
        $("#doc-last-edited").text(response.data.lastEdited);
        $("#main-doc-content").val(response.data.content);
        $("#your-role").text(userRole + " Mode");

        //text area is readonly for viewer
        if (userRole.toUpperCase() === "VIEWER") {
          $("#main-doc-content").prop("readonly", true);
        }

        //check if not owner - hide the change role form
        console.log(
          "user connedted: " +
            localStorage.getItem("userId") +
            " Owner id: " +
            response.data.owner.id
        );
        if (localStorage.getItem("userId") != response.data.owner.id) {
          $("#change-role-form").hide();
        } else {
          $("#change-role-form").show();
        }
        let input = $("#main-doc-content");
        let start;
        let end;
        let didIdelete = false;
        let nameIsSent = false;
        input.on("keydown", (event) => {
          if (!nameIsSent) {
            // sendName($("#userInput").val());
            // sendName(localStorage.getItem("userName"));
            nameIsSent = true;
          }
          start = input.prop("selectionStart");
          end = input.prop("selectionEnd");
          var key = event.keyCode || event.charCode;
          if (key == 8 || key == 46) {
            if (start - 1 >= -1 && end - 1 >= 0) {
              if (start == end) {
                addUpdate(
                  localStorage.getItem("userId"),
                  "DELETE",
                  null,
                  start - 1,
                  end - 1
                );
              } else {
                addUpdate(
                  localStorage.getItem("userId"),
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
                localStorage.getItem("userId"),
                "APPEND",
                event.originalEvent.data,
                end,
                end
              );
            } else {
              addUpdate(
                localStorage.getItem("userId"),
                "APPEND_RANGE",
                event.originalEvent.data,
                start - 1,
                end - 1
              );
            }
          }
          didIdelete = false;
        });
      } else {
        alert(response.message);
      }
    })

    .catch((error) => {
      console.error(`ERROR: ${error}`);
    });
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
  const list = document.createDocumentFragment();
  viewingUsers
    .filter((user) => user != thisUser)
    .forEach((user, i) => {
      let li = document.createElement("li");
      li.setAttribute("id", `${user}`);
      li.setAttribute("class", `${user}`);
      li.setAttribute("name", `${user}`);
      let name = document.createElement("span");
      name.innerHTML = `${user}`;
      li.appendChild(name);
      list.appendChild(li);
    });

  $("#viewingUsers").html(list);

  console.log(viewingUsers);
};

const update = (updateData) => {
  let textArea = $("#main-doc-content");
  // let user = $("#userInput").val();
  let user = localStorage.getItem("userId");
  let start = textArea.prop("selectionStart");
  if (user != updateData.userId) {
    textArea.val(updateData.documentText);

    if (updateData.updateTypeDTO == "APPEND") {
      if (updateData.startPosition < start) {
        start = start + (updateData.endPosition - updateData.startPosition + 1);
        console.log(start);
        console.log("the pointor is moved to " + start);
        textArea[0].setSelectionRange(start, start);
      } else {
        textArea[0].setSelectionRange(start, start);
      }
    } else if (updateData.updateTypeDTO == "DELETE") {
      if (updateData.startPosition < start) {
        start = start - (updateData.endPosition - updateData.startPosition + 1);
        console.log(start);
        console.log("the pointor is moved to the left" + start);
        textArea[0].setSelectionRange(start, start);
      } else {
        textArea[0].setSelectionRange(start, start);
      }
    } else if (
      updateData.updateTypeDTO == "DELETE_RANGE" ||
      updateData.updateTypeDTO == "APPEND_RANGE"
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

const initEditRoleForm = (docId) => {
  $("#changeRoleBtn").on("click", function (event) {
    event.preventDefault();
    const roleForm = {
      ownerId: localStorage.getItem("userId"), //CHANGE HARD CODED USER
      docId: docId,
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
