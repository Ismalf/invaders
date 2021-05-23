import {
    Route,
    Switch,
    Redirect,
} from "react-router-dom";
import GameBoard from "../game_objects/game_board/game_board";
import About from "../pages/about/about";
import Menu from '../pages/menu/menu';
import Score from '../pages/score/score';

const Routes = () =>
    <Switch>
        <Route exact path="/">
            <Redirect push to="/menu" />
        </Route>
        <Route path="/menu" component={Menu} />
        <Route path="/game" component={GameBoard} />
        <Route path="/score" component={Score} />
        <Route path="/about" component={About} />
    </Switch>

export default Routes;