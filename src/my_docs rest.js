import { serverAddress } from "./constants";
const test = document.getElementById("test");
console.log(test);
const ull = document.getElementById("ull");
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
      return response.json();
    })
    .then((data) => {
      let inodes = data;
      console.log(inodes);
      console.log("ULL " + ull);
      inodes.map(function (inode) {
        let li = document.createElement("li");
        let name = document.createElement("h5");
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
  //ull.appendChild(list);
};

export { getChildren };
