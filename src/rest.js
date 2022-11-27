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
      //-----catches- need to edit-------------------------------
      data.then(function (result) {
        let msg = result.message;
        console.log(msg);
        if (msg == undefined) {
          addSuccessLabel(result);
          disableSignup();
        } else console.log(msg);
      });
    })
    .catch((error) => {
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
      redirect("/my_docs");
    })
    .catch((error) => {
      console.error(`ERROR: ${error}`);
    });
};

const getDocument = (docId) => {
  fetch(serverAddress + "/doc/" + docId, {
    method: "GET",
    mode: "no-cors",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST,PATCH,OPTIONS,GET",
    },
  }).then((respons) => {
    console.log("the file content is ", respons);
    return respons.body;
  });
};
const changeUserRole = (docId, userId, ownerId, userRole) => {
  fetch(serverAddress + "/doc/" + docId, {
    method: update,
    body: JSON.stringify({
      userId: userId,
      ownerId: ownerId,
      userRole: userRole,
    }),
  })
    .then(() => {})
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
