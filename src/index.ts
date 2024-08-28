import {connection, server as WebSocketServer} from 'websocket';
import http from 'http'
import { IncomingMegssages, SupportedMessages } from './messages';
import { UserManager } from './UserManager';
import { InMemoryStore } from './store/InMemoryStore';

const server = http.createServer(function(request: any, response: any) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});

const userManagaer = new UserManager();
const store = new InMemoryStore();
 
server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});



function originIsAllowed(origin: string) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        // todo add rate limiting logic here 
        if (message.type === 'utf8') {
            try{
                messageHandler(connection, JSON.parse(message.utf8Data));
            }catch(e){

            }
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

function messageHandler (ws: connection, message: IncomingMegssages){
    if(message.type == SupportedMessages.JoinRoom){
        const payload = message.payload
        userManagaer.addUser(payload.name , payload.userId, payload.roomId, ws)
    }

    if(message.type == SupportedMessages.SendMessage){
        const payload = message.payload
        const user = userManagaer.getUser(payload.roomId, payload.userId)
        if(!user){
            console.error("User not found in the chat ")
            return 
        }
        store.addChat(payload.userId, user.name, payload.roomId, payload.message)   
    }

    if(message.type == SupportedMessages.UpvoteMessage){
        
    }
}