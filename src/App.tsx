import React from 'react';
import GameBoard from './components/game_objects/game_board/game_board';
import Menu from './components/pages/menu'
import './App.css';

// comandos para red hospedada
// netsh wlan set hostednetwork mode=allow ssid=testsi key=12345678
// netsh wlan start hostednetwork
// ($env:HTTPS = "true") -and (npm start)
function App() {
  return (
    <div className="gamescreen">
      <Menu />
    </div>
  );
}

export default App;
