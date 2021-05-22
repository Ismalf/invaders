
import './App.css';
import Routes from './components/routes/routes';
import { HashRouter as Router } from "react-router-dom";
// comandos para red hospedada
// netsh wlan set hostednetwork mode=allow ssid=testsi key=12345678
// netsh wlan start hostednetwork
// ($env:HTTPS = "true") -and (npm start)
function App() {
  return (
    <Router>
      <div className="gamescreen">
        <Routes />
      </div>
    </Router>
  );
}

export default App;
