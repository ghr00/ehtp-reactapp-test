
import React from 'react';
import axios from 'axios';
import io from 'socket.io-client';

function Home() {
  const hostname = 'https://ehtp-web-api.herokuapp.com';

  const [username, setUsername] = React.useState(null);

  const [token, setToken] = React.useState(null);

  const [messages, setMessages] = React.useState([]);

  const [receivedMessage, setReceivedMessage] = React.useState("");

  const [messageText, setMessageText] = React.useState("");

  const [socket, setSocket] = React.useState(false);

  const onUsernameChange = (event : any) => {
    setUsername(event.target.value);
  }

  const onMessageTextChange = (event : any) => {
    setMessageText(event.target.value);
  }

  const sendMessage = (text : string) => {

    //alert(text)
    if(socket)
      socket.emit('message', { token, text, platform:'Web' }) //send the jwt

  }

  React.useEffect( () => {
    if(receivedMessage.length > 0)
    {
      setMessages([...messages, receivedMessage]);
      setReceivedMessage('');
    }
    //alert(messages.length);
  }, [receivedMessage]);

  const sendConnectionReq = () => {
      axios.get(hostname + '/login', {params : {username}})
      .then( (response) => {
        setToken(response.data.token);

        return true;
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then( () => {
        alert(`CONNECTED ${token}`);
        if(token) {
          const _socket = io.connect(hostname);

          _socket.on('broadcast',function(data) {
            setReceivedMessage(data.message);
          });

          setSocket(_socket);

          return true;
        }
        return false;
      })
  }
  return (
    <div>
    <h1>
      Amine Yahemdi
    </h1>
    <h3>
    API de test pour Web2.0
    </h3>
    <h4>
    Votre etat: { token ?  <span>Connecté</span> : <span>Deconnecté</span>}
    </h4>
    <input type="text" onChange={onUsernameChange} />
    <button onClick={sendConnectionReq}>Se connecter</button>

    {
      messages ? <div>{ messages.map(function(item, i){
        return <li key={i}>{item}</li>;
      })}</div> : null
    }


<input type="text" value={messageText} onChange={onMessageTextChange} />
    <input type='button' value='Envoyer' onClick={() => sendMessage(messageText)} />
    </div>
  );
}

export default Home;
