import { serverAddress } from "./constants";
import { update } from "./doc-functions";
import { redirect } from "./router";

//--Registration-----------------------------------------------------------------------------------
const createUser = (user) => {
  console.log("REST-REGISTER- START...");
  fetch(serverAddress + "/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name: user.name,
      email: user.email,
      password: user.password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      if (response.success) {
        alert("registration successful! Welcome " + response.data.name);
        redirect("/login");
      } else {
        alert(response.message);
      }
    })
    .catch((error) => {
      console.error(`ERROR: ${error}`);
    });
};

//--Login-----------------------------------------------------------------------------------
const userLogin = (user) => {
  console.log("REST-LOGIN- START...");
  fetch(serverAddress + "/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: user.email,
      password: user.password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      if (response.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.id);
        localStorage.setItem("userName", response.data.name);
        alert("Login successful, redirecting to your docs...");
        redirect("/my_docs");
      } else {
        alert(response.message);
      }
    })
    .catch((error) => {
      console.error(`ERROR: ${error}`);
    });
};

//--Get Document--------------------------------------------------------------------------------
const getDocument = (docId) => {
  return new Promise((resolve, reject) => {
    fetch(serverAddress + "/doc/" + docId, {
      method: "GET",
      headers: {
        userId: localStorage.getItem("userId"),
        token: localStorage.getItem("token"),
      },
    })
      .then((response) => {
        return resolve(response.json());
      })
      .catch((err) => reject(err));
  });
};

//--Change User Role---------------------------------------------------------------------------
const changeUserRole = (roleForm) => {
  console.log("IN CHANGEUSERROLE FUNCTION", roleForm);
  fetch(serverAddress + "/doc/changeUserRoll/" + roleForm.docId, {
    method: "POST",
    body: JSON.stringify({
      ownerId: roleForm.ownerId,
      email: roleForm.email,
      userRole: roleForm.role.toUpperCase() === "REMOVE" ? null : roleForm.role,
      isDelete: roleForm.role.toUpperCase() === "REMOVE" ? true : false,
    }),
    headers: {
      "Content-Type": "application/json",
      userId: localStorage.getItem("userId"),
      token: localStorage.getItem("token"),
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      if (response.success) {
        alert("Role changed to: " + response.data.userRole);
      } else {
        alert(response.message);
      }
    })
    .catch((error) => {
      console.error(`ERROR: ${error}`);
    });
};

export { createUser, getDocument, changeUserRole, userLogin };
