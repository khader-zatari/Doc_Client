import { serverAddress } from "./constants";
import { update } from "./doc-functions";

const createUser = (user) => {
  fetch(serverAddress + "/user", {
    method: "POST",
    body: JSON.stringify({
      name: user.name,
      email: user.email,
      password: user.password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
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

//Sharon's

export { createUser, getDocument, changeUserRole };

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
