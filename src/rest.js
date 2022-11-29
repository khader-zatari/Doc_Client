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
    .then((res) => {
      let data = res.json();
      console.log(data);
      redirect("/login");
    })
    .catch((error) => {
      console.log("i'm ERROR");
      console.error(error);
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
    .then((data) => {
      console.log(data);
      //TODO: save token in localstorage.
      redirect("/my_docs");
    })
    .catch((error) => {
      console.error(`ERROR: ${error}`);
    });
};

//--Document-----------------------------------------------------------------------------------
const getDocument = (docId) => {
  return new Promise((resolve, reject) => {
    fetch(serverAddress + "/doc/" + docId, {
      method: "GET",
    })
      .then((response) => {
        return resolve(response.json());
      })
      .catch((err) => reject(err));
  });
};

// const getDocument = (docId) => {
//   console.log("GETTING DOCUMENT ID " + docId);
//   fetch(serverAddress + "/doc/" + docId, {
//     method: "GET",
//     // mode: "no-cors",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   })
//     .then((response) => {
//       console.log(response);
//       return response;
//     })
//     .then((data) => {
//       console.log(data);
//     });
// };

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
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch(() => {});
};

export { createUser, getDocument, changeUserRole, userLogin };

/**
 * 
 * 
 * const createUser = (user) => {
  console.log(user);
  fetch(serverAddress + "/auth/signup", {
    method: 'POST',
    body: JSON.stringify({ nickName: user.nickName, email: user.email, password: user.password }),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST,PATCH,OPTIONS'
    }
  }).then((res => {
    let data = res.json();
    data.then(function (result) {
      let msg = result.message;
      if (msg == undefined) {
        addSuccessLabel(result);
        disableSignup();

      }
      else
        addErrorLabel(msg);
    });
  }))
}
 */
