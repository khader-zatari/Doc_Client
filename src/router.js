const route = (event) => {
  event = event || window.event;
  event.preventDefault();
  window.history.pushState({}, "", event.target.href);
  handleLocation();
};

const routes = {
  404: "templates/404.html",
  "/": "templates/home.html",
  "/aobut": "templates/about.html",
  "/lorem": "templates/lorem.html",
};

const handleLocation = async () => {
  const path = window.location.pathname;
  const route = routes[path] || routes[404];
  console.log(route);
  const html = await fetch(route).then((data) => data.text());
  //console.log("page content:" + html);
  document.getElementById("main-page").innerHTML = html;
};

window.onpopstate = handleLocation;
window.route = route;

handleLocation();

export { route, routes, handleLocation };
