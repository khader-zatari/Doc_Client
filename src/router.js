import { getChildren } from "./my_docs rest";
import { startEditingDoc, initExport, initEditRoleForm } from "./doc-functions";
import { getDocument } from "./rest";
import $ from "jquery";
import { initRegister } from "./register";
import { initLogin } from "./login";
import { initImport } from "./my_docs rest";
import { initGreeting } from "./greeting";

const route = (event) => {
  event = event || window.event;
  event.preventDefault();
  window.history.pushState({}, "", event.target.href);
  handleLocation();
};

const redirect = (page) => {
  window.history.pushState({}, "", page);
  handleLocation();
};

const redirectToDoc = (page, docId, userId, userRole) => {
  //delete user id( it's in local storage)
  window.history.pushState({}, "", page);
  handleLocationWithDoc(docId, userId, userRole);
};

const routes = {
  404: "templates/404.html",
  "/": {
    url: "templates/home.html",
    action: () => {
      initGreeting();
    },
  },
  "/register": {
    url: "templates/register.html",
    action: () => {
      initRegister();
    },
  },
  "/login": {
    url: "templates/login.html",
    action: () => {
      initLogin();
    },
  },
  "/my_docs": {
    url: "templates/my_docs.html",
    action: () => {
      getChildren(1);
      initImport();
    },
  },
  "/editing_doc": {
    url: "templates/editing_doc.html",
    action: (docId, userId, userRole) => {
      //take userId from local storage
      startEditingDoc(docId, userId, userRole); //delte user id (stored in local storage);
      initExport();
      initEditRoleForm(docId);
    },
  },
};

const handleLocationWithDoc = async (docId, userId, userRole) => {
  const path = window.location.pathname;
  const route = routes[path].url || routes[404];
  const html = await fetch(route).then((data) => data.text());

  document.getElementById("main-page").innerHTML = html;
  routes[path].action(docId, userId, userRole);
};

const handleLocation = async () => {
  const path = window.location.pathname;
  const route = routes[path].url || routes[404];
  const html = await fetch(route).then((data) => data.text());

  document.getElementById("main-page").innerHTML = html;
  routes[path].action();
};

window.onpopstate = handleLocation;
window.route = route;

handleLocation();

export {
  route,
  routes,
  handleLocation,
  redirect,
  redirectToDoc,
  handleLocationWithDoc,
};
