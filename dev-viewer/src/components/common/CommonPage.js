import React, { useEffect, useState, useReducer } from "react";
import { Menu, Form, Input, Loader, Icon } from 'semantic-ui-react'
import StackGrid from 'react-stack-grid';
import * as api from '../../rest/api'
import axios from 'axios';

export default function CommonPage(props) {

    const [consents, setConsents] = useState(false);
    const [sp, setSp] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        setSp(window.innerWidth < 767);
    }, [window.innerWidth])

    function onCheckEnter(e) {
        if (e.key === 'Enter') {
            searching();
        }
    }

    function delSearch() {
        setSearch('');
    }

    function searching() {
        console.log(search);
    }

    return(
        <>
        <div className='common-main'>
            <Menu.Item className='common-search'>
                <Form onKeyPress={onCheckEnter}>
                    <Input iconPosition='left' autoFocus={true} placeholder='검색' value={search} onChange={(e) => setSearch(e.target.value)}>
                        {0 < search.length && <Icon className='search-del' name='times circle' onClick={delSearch}/>}
                        <input className='search-input'/>
                        <Icon className='search-btn' name='search' onClick={searching}/>
                    </Input>
                </Form>
            </Menu.Item>
            <div className='common-posts'>
                <StackGrid columnWidth={sp ? 380 : 260} gutterWidth={8} gutterHeight={8}>
                    <figure>
                        <img src='http://localhost:3000/images/menu/1/1.png'/>
                        <figcaption>image1</figcaption>
                    </figure>
                    <figure>
                        <img src='http://localhost:3000/images/menu/1/2.png'/>
                        <figcaption>image4</figcaption>
                    </figure>
                    <figure>
                        <img src='http://localhost:3000/images/shop/default.png'/>
                        <figcaption>image2</figcaption>
                    </figure>
                    <figure>
                        <img src='http://localhost:3000/images/menu/default.png'/>
                        <figcaption>image3</figcaption>
                    </figure>
                    <figure>
                        <img src='http://localhost:3000/images/menu/1/1.png'/>
                        <figcaption>image1</figcaption>
                    </figure>
                    <figure>
                        <img src='http://localhost:3000/images/menu/1/2.png'/>
                        <figcaption>image4</figcaption>
                    </figure>
                    <figure>
                        <img src='http://localhost:3000/images/shop/default.png'/>
                        <figcaption>image2</figcaption>
                    </figure>
                    <figure>
                        <img src='http://localhost:3000/images/menu/default.png'/>
                        <figcaption>image3</figcaption>
                    </figure>
                    <figure>
                        <img src='http://localhost:3000/images/menu/default.png'/>
                        <figcaption>image3</figcaption>
                    </figure>
                    <figure>
                        <img src='http://localhost:3000/images/menu/1/1.png'/>
                        <figcaption>image1</figcaption>
                    </figure>
                    <figure>
                        <img src='http://localhost:3000/images/menu/1/2.png'/>
                        <figcaption>image4</figcaption>
                    </figure>
                    <figure>
                        <img src='http://localhost:3000/images/shop/default.png'/>
                        <figcaption>image2</figcaption>
                    </figure>
                    <figure>
                        <img src='http://localhost:3000/images/menu/default.png'/>
                        <figcaption>image3</figcaption>
                    </figure>
                    <figure>
                        <img src='http://localhost:3000/images/menu/default.png'/>
                        <figcaption>image3</figcaption>
                    </figure>
                    <figure>
                        <img src='http://localhost:3000/images/menu/1/1.png'/>
                        <figcaption>image1</figcaption>
                    </figure>
                    <figure>
                        <img src='http://localhost:3000/images/menu/1/2.png'/>
                        <figcaption>image4</figcaption>
                    </figure>
                    <figure>
                        <img src='http://localhost:3000/images/shop/default.png'/>
                        <figcaption>image2</figcaption>
                    </figure>
                    <figure>
                        <img src='http://localhost:3000/images/menu/default.png'/>
                        <figcaption>image3</figcaption>
                    </figure>
                    <figure>
                        <img src='http://localhost:3000/images/menu/default.png'/>
                        <figcaption>image3</figcaption>
                    </figure>
                </StackGrid>
                <Loader active={true} inline='centered' size='small' className='common-loader'/>
                <div className='common-content-final-empty'> </div>
            </div>
        </div>
        </>
    )
  };