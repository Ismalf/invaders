import Transition from '../../animations/transition';
import React from 'react';
import { Redirect } from "react-router-dom";
import { MenuItemList, MenuScreen, Title, MenuItemContent, MenuItem } from '../../styled_components/menu_styled_components'

interface MenuState {
    redirectTo: string | null
}

class Menu extends React.Component<{}, MenuState> {
    constructor(props: any) {
        super(props);
        this.state = {
            redirectTo: null
        }
    }

    render() {
        if (this.state.redirectTo) {
            return (
                <Redirect push to={this.state.redirectTo}></Redirect>
            );
        }
        return (
            <Transition>
                <MenuScreen>
                    <Title>REACT INVADERS</Title>
                    <MenuItemList>
                        <MenuItem onClick={() => this.redirectTo('/game')}>
                            <MenuItemContent>
                                <label>Play</label>
                                <span className="material-icons">videogame_asset</span>
                            </MenuItemContent>
                        </MenuItem>
                        <MenuItem onClick={() => this.redirectTo('/about')}>
                            <MenuItemContent>
                                <label>About</label>
                                <span className="material-icons">info</span>
                            </MenuItemContent>
                        </MenuItem>
                        {/* <MenuItem onClick={() => this.redirectTo('/')}>
                            <MenuItemContent>
                                <label>Save</label>
                                <span className="material-icons">get_app</span>
                            </MenuItemContent>
                        </MenuItem> */}
                    </MenuItemList>
                </MenuScreen>
            </Transition>
        )
    };

    redirectTo = (path: string) => this.setState({ redirectTo: path });
}

export default Menu;