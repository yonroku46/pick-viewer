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
        window.scrollTo({ top: 4, behavior: 'smooth' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
                <StackGrid
                columnWidth={sp ? 380 : 260} gutterWidth={8} gutterHeight={8}>
                {render()}
                </StackGrid>
                <Loader active={true} inline='centered' size='small' className='common-loader'/>
                <div className='common-content-final-empty'> </div>
            </div>
        </div>
        </>
    )
  };