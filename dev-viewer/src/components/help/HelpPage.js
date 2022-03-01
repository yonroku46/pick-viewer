import React, { useEffect, useState, useReducer } from "react";
import * as api from '../../rest/api'
import axios from 'axios';
import { Menu, Segment, Dimmer, Loader, Icon } from 'semantic-ui-react';

export default function HelpPage(props) {

    const [loading, setLoading] = useState(false);
    const [activeItem, setActiveItem] = useState('shopInfo');

    function handleItemClick (e, { name }) {
        setActiveItem(name);
    }

    function testView() {
        return (
            <>
            testView
            </>
        )
    }

    function Loading() {
        return(
            <Dimmer active inverted>
              <Loader size='large'></Loader>
            </Dimmer>
          )
    }

    return (
    <div className="help-main">
        <Menu className='dashboard-menu' vertical>
            <>
            <Menu.Header><Icon name='hdd'/> Help</Menu.Header>
            <Menu.Menu>
                <Menu.Item name='notice' active={activeItem === 'notice'} onClick={handleItemClick}>
                    공지사항
                </Menu.Item>
                <Menu.Item name='contact' active={activeItem === 'contact'} onClick={handleItemClick}>
                    문의
                </Menu.Item>
                <Menu.Item name='etc' active={activeItem === 'etc'} onClick={handleItemClick}>
                    기타
                </Menu.Item>
            </Menu.Menu>
            </>
        </Menu>
        <Segment className='dashboard-viewer'>
            {loading ? <Loading/>
            :
            <>
            {activeItem === 'notice' && testView()}
            </>
            }
        </Segment>
    </div>
    )
  };