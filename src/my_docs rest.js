import $ from "jquery";
import { serverAddress } from "./constants";
import { redirect, redirectToDoc } from "./router";
import { openConnection } from "./sockets";

let currentDirId = 1;
const ull = $("#ull");
const list = document.createDocumentFragment();

const getChildren = (id) => {
  console.log(">>>>>>>>>GETTING CHILDREN OF INODE" + id);
  fetch(serverAddress + "/fs/level", {
    method: "POST",
    body: JSON.stringify({
      id: id,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then((response) => {
      if (response.success) {
        let inodes = response.data;
        console.log(inodes);
        if (inodes.length == 0) {
          $("#ull").empty();
          $("#emptyMessage").text("This folder is empty");
        }
        inodes.map(function (inode) {
          let li = document.createElement("li");
          li.setAttribute("id", `${inode.id}`);
          li.setAttribute("type", `${inode.type}`);
          li.setAttribute("name", `${inode.name}`);
          li.onclick = function () {
            let inodeId = li.getAttribute("id");
            console.log(
              "inode clicked " + inodeId + " type: " + li.getAttribute("class")
            );

            if (li.getAttribute("type") == "DIR") {
              $("#ull").empty();
              $("#path").append(li.getAttribute("name") + "/");
              getChildren(inodeId);
              currentDirId = inodeId;
              //console.log("Current dir id changed:" + currentDirId);
            } else {
              //permission check before opening a document
              return fetch(serverAddress + "/doc/getPerm", {
                method: "POST",
                body: JSON.stringify({
                  userId: localStorage.getItem("userId"),
                  docId: inodeId,
                }),
                headers: {
                  "Content-Type": "application/json",
                  userId: localStorage.getItem("userId"),
                  token: localStorage.getItem("token"),
                },
              })
                .then((response) => {
                  return response.json();
                })
                .then((response) => {
                  if (response.success) {
                    localStorage.setItem("docId", parseInt(inodeId));
                    openConnection();

                    redirectToDoc(
                      "/editing_doc",
                      inodeId,
                      localStorage.getItem("userId"), //TODO: delete userid
                      response.data.userRole
                    );
                  } else {
                    alert(response.message);
                  }
                })
                .catch((error) => {
                  console.log(`Error: ${error}`);
                });
            }
          };

          let name = document.createElement("span");
          let type = document.createElement("span");
          let icon = document.createElement("i");
          icon.className =
            li.getAttribute("type") == "DIR"
              ? "bi bi-folder"
              : "bi bi-file-earmark";

          name.innerHTML = ` (${inode.name}) `;
          type.innerHTML = ` (${inode.type}) `;

          li.appendChild(icon);
          li.appendChild(name);
          li.appendChild(type);
          list.appendChild(li);
        });
        $("#ull").append(list);
      } else {
        alert(response.message);
      }
    })
    .catch((error) => {
      console.error(`ERROR: ${error}`);
    });
};

const initImport = () => {
  $("#importBtn").on("click", function (event) {
    event.preventDefault();
    const formData = new FormData();
    const fileField = document.querySelector('input[type="file"]');
    formData.append("file", fileField.files[0]);
    formData.append("parentInodeId", currentDirId);
    formData.append("userId", localStorage.getItem("userId"));
    if (fileField.files.length == 0) {
      alert("Please upload a file...");
    } else {
      uploadFile(formData);
    }
  });
};

const uploadFile = (formData) => {
  console.log("REST-UPLOAD FILE");
  fetch(serverAddress + "/fs/uploadFile", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      if (response.success) {
        alert("File " + response.data.name + ".txt was uploaded successfully");
        redirect("/my_docs");
      } else {
        alert(response.message);
      }
    })
    .catch((error) => {
      console.error(`ERROR: ${error}`);
    });
};

export { getChildren, initImport };
