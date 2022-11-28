import $ from "jquery";
import { userLogin } from "./rest";

const initLogin = () => {
  $("#loginButton").on("click", function (event) {
    event.preventDefault();
    const user = {
      email: $("#email").val(),
      password: $("#password").val(),
    };
    console.log(user);
    userLogin(user);
  });
};

export {initLogin}
