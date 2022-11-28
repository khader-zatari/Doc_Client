import $ from "jquery";

import { serverAddress } from "./constants";
const test = document.getElementById("test");
console.log(test);
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
      console.log("ULL " + ull);
      inodes.map(function (inode) {
        let li = document.createElement("li");
        li.setAttribute("id", `${inode.id}`);
        li.setAttribute("class", `${inode.type}`);
        li.onclick = function () {
          console.log("inode clicked " + li.getAttribute("id"));
        };

        let name = document.createElement("span");
        let type = document.createElement("span");

        name.innerHTML = `${inode.name}`;
        type.innerHTML = `${inode.type}`;

        li.appendChild(name);
        li.appendChild(type);
        list.appendChild(li);
      });
    })
    .catch((error) => {
      console.error(`ERROR: ${error}`);
    });
  $("#ull").append(list);
};

export { getChildren };
