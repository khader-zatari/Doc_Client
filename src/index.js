import $ from "jquery";
import { createUser } from "./rest";
import { openConnection } from "./sockets";
import { route, routes, handleLocation } from "./router";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { sayHi } from "./register";
import {loginUser} from "./rest"

//EVERYTHING THAT WE WRITE IN ANOTHER JS FILES SHOULD BE IMPORTED TO HERE!
//ALL FUNCTIONS IN THE JS FILES SHOULD BE EXPORTED.

$(() => {
  $(window).on("load", () => {
    sayHi();
  });
});

$(() => {
  $(document).on("submit", (e) => {
    e.preventDefault();
    const user = {
      email: $("#email").val(),
      name: $("#name").val(),
      password: $("#password").val(),
    };
    console.log(user);
    createUser(user);
  })
});


$(() => {
  $(document).on("submit", (e) => {
    e.preventDefault();
    const user = {
      email: $("#emailLogin").val(),
      password: $("#passwordLogin").val(),
    };
    console.log(user);
    loginUser(user);
  })
});




openConnection();
