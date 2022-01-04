import { useEffect, useState, useReducer } from "react";
import * as api from '../../rest/server'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Menu, Form, Input, Dimmer, Loader, Icon, Label } from 'semantic-ui-react';

export default function SearchPage(props) {

    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    function backPage() {
        props.history.goBack(1);
    }
    
    function Loading() {
        return(
            <Dimmer active inverted>
              <Loader size='large'>로딩중</Loader>
            </Dimmer>
          )
    }

    function onCheckEnter(e) {
        if(e.key === 'Enter') {
            searching();
        }
    }
    
    function searching() {
        console.log(search);
    }
    
    return(
        <div className='search-main'>
            <Menu.Item className='shopmodal-search'>
                <Form onKeyPress={onCheckEnter}>
                    <Input iconPosition='left' autoFocus={true} placeholder='위치 또는 매장명을 입력해주세요' value={search} onChange={(e) => setSearch(e.target.value)}>
                        <Icon className='search-back' name='times circle' onClick={backPage}/>
                        <input className='search-input'/>
                        <Icon className='search-btn' name='search' onClick={searching}/>
                    </Input>
                </Form>
            </Menu.Item>
            <div className='search-hashtag'>
                <Label as='a'>
                    <Icon name='hashtag'/>추천검색어1
                </Label>
                <Label as='a'>
                    <Icon name='hashtag'/>추천검색어2
                </Label>
                <Label as='a'>
                    <Icon name='hashtag'/>추천검색어3
                </Label>
            </div>
        </div>
    )
}