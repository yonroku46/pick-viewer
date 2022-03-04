import React, { useEffect, useState, useReducer } from "react";
import * as api from '../../rest/api'
import axios from 'axios';
import NoticePage from "./NoticePage";
import ContactPage from "./ContactPage";
import AboutPage from "./AboutPage";
import { Menu, Container } from 'semantic-ui-react';

export default function HelpPage(props) {

    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [activeItem, setActiveItem] = useState('notice');

    function handleItemClick (e, { name }) {
        setActiveItem(name);
        setVisible(false);
    }

    return (
    <div className="help-main">
        {/* <Sidebar as={Menu}
          animation='overlay'
          direction='top'
          icon='labeled'
          onHide={() => setVisible(false)}
          visible={visible}
          className='help-main-menu'
        > */}
        <Menu>
            <Menu.Item name='notice' active={activeItem === 'notice'} onClick={handleItemClick}>
                공지사항
            </Menu.Item>
            <Menu.Item name='contact' active={activeItem === 'contact'} onClick={handleItemClick}>
                문의
            </Menu.Item>
            <Menu.Item name='about' active={activeItem === 'about'} onClick={handleItemClick}>
                Pick
            </Menu.Item>
        </Menu>
        {/* </Sidebar> */}

        <Container className="mypage-content-table">
            {
            activeItem === 'notice'? <NoticePage/>
            :
            activeItem === 'contact'? <ContactPage/>
            :
            activeItem === 'about'? <AboutPage/>
            :
            <></>
             }
        </Container>

        <button onClick={() => setVisible(!visible)}/>
    </div>
    )
  };