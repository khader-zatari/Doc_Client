import $ from "jquery";
import { createUser, userLogin } from "./rest";
import { openConnection } from "./sockets";
import { route, routes, handleLocation } from "./router";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { sayHi } from "./register";
import { serverAddress } from "./constants";
import { getChildren } from "./my_docs rest";
import { getDocument } from "./rest";

//EVERYTHING THAT WE WRITE IN ANOTHER JS FILES SHOULD BE IMPORTED TO HERE!
//ALL FUNCTIONS IN THE JS FILES SHOULD BE EXPORTED.

$(() => {
  //this doesnt work because the DOM
  //of my_docs is not recognized
  getChildren(1);
});

$(() => {
  getDocument(4);
});

// $(() => {
//   $(document).on("submit", (e) => {
//     e.preventDefault();
//     const user = {
//       email: $("#email").val(),
//       name: $("#name").val(),
//       password: $("#password").val(),
//     };
//     console.log(user);
//     createUser(user);
//   });
// });

//--------------Login-------------
$(() => {
  $(document).on("submit", (e) => {
    e.preventDefault();
    const user = {
      email: $("#email").val(),
      password: $("#password").val(),
    };
    console.log("IN LOGIN");
    console.log(user);
    e.preventDefault();
    userLogin(user);
  });
});
//---------------------------------

//--Sockets-------------------------------------
openConnection();
