import React from 'react';
import Transition from '../../animations/transition';
import { Title, SubTitle, MenuItemContent, MenuItem, MenuItemList } from '../../styled_components/menu_styled_components';
import { AboutPage, AboutParagraph } from '../../styled_components/about_page_styled_components';
import { Redirect } from 'react-router';

interface AboutState {
    redirectTo: string | null
}
class About extends React.Component<{}, AboutState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            redirectTo: null
        }
    }
    render() {
        if (this.state.redirectTo) {
            return (
                <Redirect push to={this.state.redirectTo}></Redirect>
            )
        }
        return (
            <Transition>
                <AboutPage>

                    <Title>Invaders</Title>
                    <SubTitle>By: Ismael Martínez</SubTitle>

                    <MenuItemList style={{height:'70%'}}>
                        <SubTitle style={{ margin: '0 auto'}}>Controls</SubTitle>
                        <AboutParagraph style={{textAlign:'justify'}}>
                            <span style={{color:'orange'}}>PC</span> : use arrow keys (left and right) to move.
                            Arrow Up is used to shoot.
                            <br></br>
                            <span style={{color:'#01ff01'}}>Android</span> : tilt your phone to move. Tap to shoot.
                            <br />
                            <span style={{color:'#01e4ff'}}>iOS</span> : Working on a way to control the ship without the accelerometer, 
                            as the Acceleration API is not supported
                        </AboutParagraph>
                    </MenuItemList>

                    <MenuItem onClick={() => this.redirectTo('/menu')}>
                        <MenuItemContent>
                            <label>Back</label>
                            <span className="material-icons">chevron_left</span>
                        </MenuItemContent>
                    </MenuItem>

                </AboutPage>
            </Transition>
        )
    }

    redirectTo = (path: string) => this.setState({ redirectTo: path });
}
export default About;