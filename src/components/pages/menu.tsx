import Transition from '../animations/transition';
import GameBoard from '../game_objects/game_board/game_board';
import './menu.css';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    NavLink,
    Redirect,
} from "react-router-dom";
import styled from 'styled-components';
const Wrapper = () =>
    <Transition>
        <Router>
            <Switch>
                <Route exact path="/">
                    <Redirect to="/menu" />
                </Route>
                <Route path="/menu">
                    <Menu>
                        <Title>REACT INVADERS</Title>
                        <NavLink className="menuItem" to="/game">Play</NavLink>
                        <NavLink className="menuItem" to="/game">About</NavLink>
                        <NavLink className="menuItem" to="/game">Add to Home Screen</NavLink>
                    </Menu>
                </Route>
                <Route path="/game">
                    <GameBoard />
                </Route>
            </Switch>
        </Router>
    </Transition>;

const Menu = styled.div`
    height:100%;
    width:100%;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:space-around;
    background-color: black;
`;
const Title = styled.div`
    width:90%;
    font-size:3em;
    color:white;
`;
export default Wrapper;