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

// $(() => {
//   //this doesnt work because the DOM
//   //of my_docs is not recognized
//   getChildren(1);
// });

// $(() => {
//   getDocument(4);
// });



//--Sockets-------------------------------------
openConnection();
