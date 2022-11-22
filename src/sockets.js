import * as SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';



import { serverAddress } from "./constants"
import { update, addViewingUser } from './doc-functions';
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
    console.log("all the active viewing users are",user);
    addViewingUser(user);
}
const onConnected = () => {
    stompClient.subscribe('/topic/updates', onMessageReceived);
    stompClient.subscribe('/topic/usersJoin', newUserViewing);

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
    stompClient.send("/app/join", [], JSON.stringify({
        userName: userName
    }))
}
const sendUpate = (user, type, content, startPosition, endPosition) => {
    stompClient.send("/app/update", [], JSON.stringify({
        user: user,
        type: type,
        content: content,
        startPosition: startPosition,
        endPosition: endPosition,
    }))
}

export { openConnection, addUpdate, sendName }