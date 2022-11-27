import $ from "jquery";
import { createUser } from "./rest";
import { openConnection } from "./sockets";
import { route, routes, handleLocation } from "./router";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { sayHi } from "./about";
//EVERYTHING THAT WE WRITE IN ANOTHER JS FILES SHOULD BE IMPORTED TO HERE!
//ALL FUNCTIONS IN THE JS FILES SHOULD BE EXPORTED.

$(() => {
  $(window).on("load", () => {
    sayHi();
  });
});

$(() => {
  $(document).on("submit", () => {
    const user = {
      email: $("#emailInput").val(),
      name: $("#userInput").val(),
      password: $("#passwordInput").val(),
    };
    createUser(user);
  });
});

openConnection();
