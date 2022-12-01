import $ from "jquery";
import { createUser, userLogin } from "./rest";
import { openConnection } from "./sockets";
import { route, routes, handleLocation } from "./router";
import "bootstrap";
//import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { sayHi } from "./register";
import { serverAddress } from "./constants";
import { getChildren } from "./my_docs rest";
import { getDocument } from "./rest";
import "./_custom.css";
require("bootstrap-icons/font/bootstrap-icons.css");

//--Sockets-------------------------------------
// openConnection();
