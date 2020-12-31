import * as AuthActions from './authActions';

/* global $ */

export const setupSocket = (token, userId) => {
    return dispatch => {
        const socket = new WebSocket('ws://localhost:8080');
        socket.onopen = () => {
            if(token){
                //Dodaje już zalogowanego użytkownika
                socket.send(JSON.stringify({
                    type: 'CONNECT_WITH_TOKEN',
                    data: {
                        token: token,
                        userId: userId
                    }
                }))
                dispatch({
                    type: 'SETUP_SOCKET',
                    payload: socket
                });
            }else{
                dispatch({
                type: 'SETUP_SOCKET',
                payload: socket
            });
        }
    }
            

        socket.onmessage = (message) => {

            let data = JSON.parse(message.data);
            switch (data.type) {
                case 'LOGGEDIN':
                    dispatch(AuthActions.loggedIn(data));
                    break;
                case 'GOT_USERS':
                    dispatch ({
                        type: 'GOT_USERS',
                        payload: data.data.users
                    });
                    break;
                case 'ADD_THREAD':
                    dispatch({
                        type: 'ADD_THREAD',
                        payload: data.data
                    })
                case 'INITIAL_THREADS':
                    dispatch({
                        type: 'INITIAL_THREADS',
                        payload: data.data
                    })
                    
                case 'GOT_MESSAGES':
                    dispatch({
                        type: 'ADD_MESSAGES_TO_THREAD',
                        payload: {
                            threadId: data.threadId,
                            messages: data.messages
                        }
                    })
                case 'ADD_MESSAGE_TO_THREAD':
                    dispatch({
                        type: 'ADD_SINGLE_MESSAGE',
                        payload: {
                            threadId: data.threadId,
                            messages: data.messages
                        }
                    });
                document.getElementById('.main-view').scrollTop = document.getElementById('.main-view').scrollHeight;            
                default:
                // nic nie robi

            }
        }
    }
}