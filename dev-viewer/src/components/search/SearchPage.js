import React, { useEffect, useState, useReducer } from "react";
import * as api from '../../rest/api'
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { Menu, Form, Input, Dimmer, Loader, Icon, Label, Grid, Transition, Message } from 'semantic-ui-react';

export default function SearchPage(props) {

    const [search, setSearch] = useState(props.location.state.searchValue ? props.location.state.searchValue : '');
    const [searchHistory, setSearchHistory] = useState([]);
    const [searchResult, setSearchResult] = useState([]);
    const [recHistory, setRecHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState(props.location.state.category);
    const categoryList = ['hairshop', 'restaurant', 'cafe'];
    const storage = window.localStorage;

    const [visible, setVisible] = useState(false);
    const duration = 500;
    const animation = 'fade down';

    const recommendValue = ['2022트렌드','분위기 좋은 매장'];

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
        const history = storage.getItem('searchHistory');
        if (history !== null) {
            const historyList = storage.getItem('searchHistory').split(',');
            historyList.pop();
            setSearchHistory(historyList);
        }
        setRecHistory(recommendValue)
        if (search.length === 0) {
            setSearchResult([]);
        } else {
            searching();
        }
    }, [category])

    function delSearch() {
        setSearch('');
    }
    
    function Loading() {
        return(
            <Dimmer active inverted>
              <Loader size='large'></Loader>
            </Dimmer>
          )
    }

    function onCheckEnter(e) {
        if (e.key === 'Enter') {
            searching();
        }
    }

    function delHistory() {
        storage.removeItem('searchHistory');
        setSearchHistory([]);
    }

    function clickHistory(value) {
        setSearch(value);
        setLoading(true);
        return new Promise(function(resolve, reject) {
          axios
            .get(api.search, {
              params: {
                'category': category,
                'value': value
              }
            })
            .then(response => resolve(response.data))
            .catch(error => reject(error.response))
        })
        .then(data => {
            if (data.success) {
                const shops = data.dataList;
                if (shops.length === 0) {
                    setSearchResult(shops);
                    setVisible(true);
                    setTimeout(() => { setVisible(false) }, 2500);
                } else {
                    setSearchResult(shops);
                }
            setLoading(false);
          }     
        })
        .catch(err => {
          alert("현재 서버와의 연결이 원활하지 않습니다. 관리자에게 문의해주세요.");
          setLoading(false);
        })
    }

    function delTarget(target) {
        let past = storage.getItem('searchHistory');
        storage.setItem('searchHistory', past.replace(target + ',', ''));
        let historyList = storage.getItem('searchHistory').split(',');
        historyList.pop();
        setSearchHistory(historyList);
    }
    
    function searching() {
        if (search.length === 0) {
            return;
        }
        let past = storage.getItem('searchHistory');
        let history = past ? past : '';

        if (history.indexOf(search) === -1) {
            history += search + ',';
            storage.setItem('searchHistory', history);

            const historyList = history.split(',');
            historyList.pop();

            if (9 < historyList.length) {
                let past = storage.getItem('searchHistory');
                storage.setItem('searchHistory', past.replace(historyList[0] + ',', ''));
            }

            setSearchHistory(historyList);
        }
        
        setLoading(true);
        return new Promise(function(resolve, reject) {
          axios
            .get(api.search, {
              params: {
                'category': category,
                'value': search
              }
            })
            .then(response => resolve(response.data))
            .catch(error => reject(error.response))
        })
        .then(data => {
            if (data.success) {
                const shops = data.dataList;
                if (shops.length === 0) {
                    setSearchResult(shops);
                    setVisible(true);
                    setTimeout(() => { setVisible(false) }, 2500);
                } else {
                    setSearchResult(shops);
                }
            setLoading(false);
          }     
        })
        .catch(err => {
          alert("현재 서버와의 연결이 원활하지 않습니다. 관리자에게 문의해주세요.");
          setLoading(false);
        })
    }
    
    return(
        <div className='search-main'>
            <Transition animation={animation} duration={duration} visible={visible}>
                <Message color='blue' onClick={() => setVisible(false)} className='mypage-msg search-msg' header='찾으시는 매장이 없습니다' content='매장에 서비스 등록을 요청해보세요!' />
            </Transition>
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
                        {0 < search.length && <Icon className='search-del' name='times circle' onClick={delSearch}/>}
                        <input className='search-input'/>
                        <Icon className='search-btn' name='search' onClick={searching}/>
                    </Input>
                </Form>
            </Menu.Item>
            <Menu.Item className='search-result'>
            {0 < searchHistory.length ?
                <div className='search-recent'>
                    <div className='search-recent-group'>
                        <h4 className='underline'>최근 검색</h4>
                        <Icon name='trash alternate outline' className='search-recent-del' onClick={delHistory}/>
                    </div>
                    {searchHistory.map(history =>
                        <Label basic className='search-recent-label'>
                            <span onClick={() => clickHistory(history)}>{history}</span>
                            <Icon name='delete' onClick={() => delTarget(history)}/>
                        </Label>
                    )}
                </div>
                :
                <div className='search-recent'>
                    <h4 className='underline'>추천 검색</h4>
                    {recHistory.map(history =>
                        <Label basic className='search-recent-label'>
                            <span onClick={() => clickHistory(history)}>{history}</span>
                        </Label>
                    )}
                </div>
            }
            {searchResult.length !== 0 &&
                <>
                {/* 검색결과 존재시 ShopModal로 결과 전송 및 페이지이동하도록 변경 */}
                <div className='search-recommend'>
                    <h4 className='underline'>검색 결과</h4>
                    {searchResult.map(shop => 
                        <Link to={`/booking/${category}/${shop.shopCd}`}>
                            <button key={shop.shopCd} style={{backgroundSize: '105%', backgroundPosition: 'center', backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.45)), url(' + api.imgRender(shop.shopImg === null ? 'images/shop/default.png' : shop.shopImg.split(',')[0]) + ')'}}>
                                <div className='shopmodal-name'>
                                    {shop.shopName}
                                </div>
                                <div className='shopmodal-location'>
                                    {shop.shopLocation}
                                </div>
                                <span className='shopmodal-rating'><Icon name='star'/>{shop.ratingsAve}</span>
                            </button>
                        </Link>
                    )}
                </div>
                </>
            }
            </Menu.Item>
        </div>
    )
}