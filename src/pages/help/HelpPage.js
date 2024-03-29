import React, { useEffect, useState, useReducer } from "react";
import * as api from '../../rest/api'
import axios from 'axios';
import { useParams, useHistory } from "react-router-dom";
import NoticePage from "./NoticePage";
import ContactPage from "./ContactPage";
import AboutPage from "./AboutPage";
import { Menu, Icon, Grid, Segment } from 'semantic-ui-react';

export default function HelpPage(props) {

    let history = useHistory();
    const [loading, setLoading] = useState(false);
    const [sp, setSp] = useState(false);
    const {item} = useParams();
    const [activeItem, setActiveItem] = useState('');

    useEffect(() => {
        setActiveItem(item);
        setSp(window.innerWidth < 767);
    }, [item])

    function handleItemClick (e, { name }) {
        history.push(`/help/${name}`);
    }

    return (
    <div className="help-main">
        <Grid>
            <Grid.Column className='help-menu' width={2}>
                <Menu className='help-menu-item' fluid vertical tabular>
                    <Menu.Item name='about' active={activeItem === 'about'} onClick={handleItemClick}>
                        {sp ? <Icon name='pinterest'/> : '소 개'}
                    </Menu.Item>
                    <Menu.Item name='notice' active={activeItem === 'notice'} onClick={handleItemClick}>
                        {sp ? <Icon name='thumbtack'/> : '공지사항'}
                    </Menu.Item>
                    <Menu.Item name='contact' active={activeItem === 'contact'} onClick={handleItemClick} >
                        {sp ? <Icon name='mail'/> : '문 의'}
                    </Menu.Item>
                </Menu>
            </Grid.Column>

            <Grid.Column stretched width={14} className='help-contents'>
                <Segment className='help-contents-active'>
                    {
                    activeItem === 'notice' ? <NoticePage sp={sp}/>
                    :
                    activeItem === 'contact' ? <ContactPage/>
                    :
                    activeItem === 'about' ? <AboutPage/>
                    :
                    <></>
                    }  
                </Segment>
            </Grid.Column>

        </Grid>
    </div>
    )
  };