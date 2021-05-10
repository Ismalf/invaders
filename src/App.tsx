import React from 'react';
import GameBoard from './components/game_board/game_board';
import './App.css';
// comandos para red hospedada
// netsh wlan set hostednetwork mode=allow ssid=testsi key=12345678
// netsh wlan start hostednetwork
// ($env:HTTPS = "true") -and (npm start)
function App() {
  const height = window.innerHeight;
  const width = window.innerWidth < 420 ? window.innerWidth : 420;
  const frameRate = 60;
  return (
    <div className="gamescreen">
      
      <GameBoard frameRate={frameRate} playgroundHeight={height} playgroundWidth={width} shotTimeOut={500} />
    </div>
  );
}

export default App;
