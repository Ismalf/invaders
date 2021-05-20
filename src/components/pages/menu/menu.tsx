import Transition from '../../animations/transition';
import GameBoard from '../../game_objects/game_board/game_board';
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
                        <MenuItemList>

                            <NavLink className="menuItem" to="/game">
                                <label>Play</label>
                                <span className="material-icons">
                                    videogame_asset
                            </span>
                            </NavLink>
                            <NavLink className="menuItem" to="/game">
                                <label>About</label>
                                <span className="material-icons">
                                    read_more
                            </span>
                            </NavLink>
                            <NavLink className="menuItem" to="/game">
                                <label>Save</label>
                                <span className="material-icons">
                                    get_app
                            </span>
                            </NavLink>
                        </MenuItemList>
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
    width:30%;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    background-color: black;
`;

const MenuItemList = styled.div`
    display:inherit;
    flex-direction:inherit;
    align-items:inherit;
    justify-content:inherit;
    width: 100%;
    height: 50%;
`;

const Title = styled.div`
    width:90%;
    font-size:3em;
    color:white;
    text-align: center;
`;

export default Wrapper;