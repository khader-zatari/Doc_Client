import $ from "jquery";
import { createUser } from "./rest";

const initRegister = () => {
  $("#registerButton").on("click", function (event) {
    event.preventDefault();
    const user = {
      email: $("#email").val(),
      name: $("#name").val(),
      password: $("#password").val(),
    };
    console.log(user);
    createUser(user);
  });
};

export { initRegister };
