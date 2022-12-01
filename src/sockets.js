import * as SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';



import { serverAddress } from "./constants"
import { update, addViewingUser } from './doc-functions';
let docId = 70;
let stompClient;
const socketFactory = () => {
    return new SockJS(serverAddress + '/ws');
}

const onMessageReceived = (payload) => {
    var message = JSON.parse(payload.body);
    update(message);
}
const newUserViewing = (payload) => {
    var user = JSON.parse(payload.body);
    console.log("all the active viewing users are", user);
    addViewingUser(user);
}
const onConnected = () => {
    stompClient.subscribe('/topic/updates/' + docId, onMessageReceived);
    stompClient.subscribe('/topic/usersJoin/' + docId, newUserViewing);
    stompClient.subscribe('/topic/userDisconnect/' + docId, newUserViewing);

}

const openConnection = () => {
    const socket = socketFactory();
    stompClient = Stomp.over(socket);
    stompClient.connect({}, onConnected);
}

const addUpdate = (user, updateType, content, startPosition, endPosition) => {
    sendUpate(user, updateType, content, startPosition, endPosition)
}
const sendName = (userName) => {
    stompClient.send("/app/join/" + docId, [], JSON.stringify({
        userName: userName
    }))
}
const sendUpate = (user, type, content, startPosition, endPosition) => {
    stompClient.send("/app/update/" + docId, [], JSON.stringify({
        userId: user,
        action: type,
        content: content,
        startPosition: startPosition,
        endPosition: endPosition,
    }))
}
const removeUser = (user) => {
    stompClient.send("app/userDisconnect/" + docId, [], JSON.stringify({
        userName: user
    }))
}

export { openConnection, addUpdate, sendName ,removeUser}