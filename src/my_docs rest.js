import $ from "jquery";
import { serverAddress } from "./constants";
import { redirect, redirectToDoc } from "./router";

const ull = $("#ull");
const list = document.createDocumentFragment();
const getChildren = (id) => {
  console.log("GETTING CHILDREN OF INODE" + id);
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
    .then((data) => {
      let inodes = data;
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
          console.log(
            "inode clicked " +
              li.getAttribute("id") +
              " type: " +
              li.getAttribute("class")
          );

          if (li.getAttribute("type") == "DIR") {
            $("#ull").empty();
            $("#path").append(li.getAttribute("name") + "/");
            getChildren(li.getAttribute("id"));
          } else {
            redirectToDoc("/editing_doc", li.getAttribute("id"));
          }
        };

        let name = document.createElement("span");
        //let type = document.createElement("span");
        let icon = document.createElement("i");
        icon.className =
          li.getAttribute("type") == "DIR"
            ? "bi bi-folder"
            : "bi bi-file-earmark";

        name.innerHTML = `${inode.name}`;
        //type.innerHTML = `${inode.type}`;

        li.appendChild(icon);
        li.appendChild(name);
        //li.appendChild(type);
        list.appendChild(li);
      });
    })
    .catch((error) => {
      console.error(`ERROR: ${error}`);
    });
  $("#ull").append(list);
};

export { getChildren };
