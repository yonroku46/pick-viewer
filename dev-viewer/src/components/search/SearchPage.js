import { useEffect, useState, useReducer } from "react";
import * as api from '../../rest/server'
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { Menu, Form, Input, Dimmer, Loader, Icon, Label, Grid } from 'semantic-ui-react';

export default function SearchPage(props) {

    const [search, setSearch] = useState('');
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(false);
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

    useEffect(() => {
        setLoading(true);
        const params = { 
            'category': category
        };
        return new Promise(function(resolve, reject) {
            axios
            .post(api.shopList, params)
            .then(response => resolve(response.data))
            .catch(error => reject(error.response))
        })
        .then(res => {
            if (res !== null) {
                setShops(res);
                setLoading(false);
            }
        })
        .catch(err => {
            alert("현재 서버와의 연결이 원활하지 않습니다. 관리자에게 문의해주세요.");
            setLoading(false);
        })
    }, [category])

    function delSearch() {
        setSearch('');
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
                        {0 < search.length && <Icon className='search-back' name='times circle' onClick={delSearch}/>}
                        <input className='search-input'/>
                        <Icon className='search-btn' name='search' onClick={searching}/>
                    </Input>
                </Form>
            </Menu.Item>
            <Menu.Item className='search-result'>
                <div className='search-recent'>
                    <h4 className='underline'>최근 검색</h4>
                    <Label>
                        검색어1
                        <Icon name='delete'/>
                    </Label>
                    <Label>
                        검색어2
                        <Icon name='delete'/>
                    </Label>
                </div>
                <div className='search-recommend shopmodal-main'>
                    <h4 className='underline'>추천 매장</h4>
                    {shops.map(shop => 
                        <Link to={`/booking/${category}/${shop.shop_cd}`}>
                            <button key={shop.shop_cd} style={{backgroundPosition: 'center', backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.45)), url(' + api.imgRender(shop.shop_img === null ? 'images/shop/default.png' : shop.shop_img.split(',')[0]) + ')'}}>
                                <div className='shopmodal-name'>
                                    {shop.shop_name}
                                </div>
                                <div className='shopmodal-location'>
                                    {shop.shop_location}
                                </div>
                                <span className='shopmodal-rating'><Icon name='star'/>{shop.ratings_ave}</span>
                            </button>
                        </Link>
                    )}
                </div>
            </Menu.Item>
        </div>
    )
}