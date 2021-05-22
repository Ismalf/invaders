import {
    Route,
    Switch,
    Redirect,
} from "react-router-dom";
import GameBoard from "../game_objects/game_board/game_board";
import Menu from '../pages/menu/menu';
import Score from '../pages/score/score';

const Routes = () =>
    <Switch>
        <Route exact path="/">
            <Redirect to="/menu" />
        </Route>
        <Route path="/menu" component={Menu} />
        <Route path="/game" component={GameBoard} />
        <Route path="/score" component={Score} />
        <Route path="/about" />
    </Switch>

export default Routes;