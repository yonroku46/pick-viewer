import React, { useEffect, useState, useReducer } from "react";
import { Menu, Form, Input, Loader, Icon, Grid } from 'semantic-ui-react'
import StackGrid from 'react-stack-grid';
import * as api from '../../rest/api'
import axios from 'axios';

export default function CommonPage(props) {

    const [consents, setConsents] = useState(false);
    const [sp, setSp] = useState(false);

    const contentList = [
        { "title": "핫플", "color": "red", "icon": "hotjar", "func": "hotplace" },
        { "title": "주변맛집", "color": "yellow", "icon": "utensils", "func": "nearby" },
        { "title": "빠른예약", "color": "green", "icon": "bolt", "func": "pick" },
        { "title": "추천매장", "color": "blue", "icon": "photo", "func": "recommend" },
        { "title": "검색", "color": "purple", "icon": "search", "func": "search" }
    ]

    useEffect(() => {
        setSp(window.innerWidth < 767);
        window.scrollTo({ top: 4, behavior: 'smooth' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [window.innerWidth])

    function render() {
        const result = [];
        for (let x = 0; x < 6; x++) {
            for (let i = 1; i < 3; i++) {
                const path1 = 'http://localhost:3000/images/menu/1/' + i + '.png'
                const path2 = 'http://localhost:3000/images/shop/2/' + i + '.png'
                result.push(
                    <>
                    <figure>
                        <img src={i % 2 == 0 ? path1 : path2}/>
                        <figcaption>image1</figcaption>
                    </figure>
                    </>
                )
            }
        }
        return result;
    }

    function menuClick(func) {
        if (func === 'search') {
            console.log(func)
        }
    }

    return(
        <>
        <div className='common-main'>
            
            <Grid container className='content-menu' relaxed unstackable>
                <Grid.Row>
                {contentList.map(content => 
                    <Grid.Column className='content-menu-button' onClick={() => menuClick(content.func)}>
                        <Icon inverted size='big' color={content.color} name={content.icon}/>
                        <span>{content.title}</span>
                    </Grid.Column>
                )}
                </Grid.Row>
            </Grid>

            <div className='common-posts'>
                <StackGrid columnWidth={sp ? 380 : 260} gutterWidth={8} gutterHeight={8}>
                    {render()}
                </StackGrid>
                <Loader active={true} inline='centered' size='small' className='common-loader'/>
                <div className='common-content-final-empty'> </div>
            </div>
        </div>
        </>
    )
  };