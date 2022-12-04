import $ from "jquery";

const initGreeting = () => {
  let greetingDiv = $("#greeting");
  if (localStorage.getItem("userName") === null) {
    greetingDiv.hide();
  } else {
    greetingDiv.text("Hello, " + localStorage.getItem("userName"));
    greetingDiv.show();
  }
};

export { initGreeting };
