import React from "react";
import { Redirect } from "react-router-dom";
import Transition from '../../animations/transition';
import { MenuItemList, MenuScreen, Title, MenuItemContent, MenuItem, SubTitle } from '../../styled_components/menu_styled_components'
interface MenuState {
    redirectTo: string | null
}
class Score extends React.Component<{}, MenuState> {
    hs: number;
    ms: number;
    constructor(props: any) {
        super(props);
        this.state = {
            redirectTo: null
        }
        this.hs = +(localStorage.getItem('highScore') ?? '0');
        this.ms = +(localStorage.getItem('matchScore') ?? '0');
    }
    render() {
        if (this.state.redirectTo) {
            return (<Redirect to={this.state.redirectTo} />);
        }
        return (
            <Transition>
                <MenuScreen>
                    <Title>YOU LOST</Title>
                    <SubTitle>{(this.ms === this.hs) ? 'New High Score' : 'Score'}: {this.ms}</SubTitle>
                    <SubTitle>High Score: {this.hs}</SubTitle>
                    <MenuItemList>
                        <MenuItem onClick={() => this.redirectTo('/game')}>
                            <MenuItemContent >
                                <label>Retry</label>
                                <span className="material-icons">videogame_asset</span>
                            </MenuItemContent>
                        </MenuItem>
                        <MenuItem onClick={() => this.redirectTo('/menu')}>
                            <MenuItemContent >
                                <label>Menu</label>
                                <span className="material-icons">chevron_left</span>
                            </MenuItemContent>
                        </MenuItem>
                    </MenuItemList>
                </MenuScreen>
            </Transition>
        );
    }

    redirectTo = (path: string) => this.setState({ redirectTo: path });
}
export default Score;