import { useEffect, useState, useReducer } from "react";
import * as api from '../../rest/server'
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { Menu, Form, Input, Dimmer, Loader, Icon, Label, Grid } from 'semantic-ui-react';

export default function SearchPage(props) {

    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [category, setCategory] = useState(props.location.state.category);
    const categoryList = ['hairshop', 'restaurant', 'cafe'];

    // category check
    if (!categoryList.includes(category)) {
        if (category === undefined) {
            setCategory('hairshop')
        } else {
            alert('존재하지 않는 카테고리입니다.')
            props.history.goBack(1);
        }
    };

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
            <div className="booking-main-category">
            <Grid columns={3} divided>
                <Grid.Row>
                    <Grid.Column onClick={() => setCategory(categoryList[0])} className={category === categoryList[0] ? 'category-active' : 'category-non-active'}>
                        <Icon name='cut' size='big'/>
                        <br/>헤어샵
                    </Grid.Column>
                    <Grid.Column onClick={() => setCategory(categoryList[1])} className={category === categoryList[1] ? 'category-active' : 'category-non-active'}>
                        <Icon name='food' size='big'/>
                        <br/>맛집
                    </Grid.Column>
                    <Grid.Column onClick={() => setCategory(categoryList[2])} className={category === categoryList[2] ? 'category-active' : 'category-non-active'}>
                        <Icon name='coffee' size='big'/>
                        <br/>카페
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            </div>
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