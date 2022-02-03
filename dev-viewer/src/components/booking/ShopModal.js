import React, { Component } from 'react';
import * as api from '../../rest/server'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Menu, Input, Dimmer, Loader, Icon, Button, Pagination } from 'semantic-ui-react';

export default class ShopModal extends Component {

    state = {
        pickFavorite: false,
        pickRating: false,
        pickPromotion: false,
        isLoading: false,
        perPage: 12,
        activePage: 1,
        shopsOrigin: [],
        shops: [],
        search: '',
        category: this.props.category
    }

    handlePaginationChange = (e, { activePage }) => this.setState({ activePage })

    // 첫 렌더링시 실행
    componentDidMount() {
        this.getShops();
    }

    // 다음에 올 프롭스 미리 세팅
    componentWillReceiveProps(nextProps) {
        this.setState({category: nextProps.category});
        return nextProps.category !== this.props.category;
    }

    // 컴포넌트 업데이트 됬을때 카테고리에 변경감지 되었다면 api 재실행
    componentDidUpdate(prevProps) {
        if (prevProps.category !== this.props.category) {
            this.getShops();
        }
    }

    getShops = async () => {
        this.setState({isLoading: true, search: ''});
        const params = { 
            'category': this.props.category
        };
        const { data } = await axios.post(api.shopList, params);
        this.setState({isLoading: false, shopsOrigin: data, shops: data });
    }

    handleChange = e => {
        const origin = this.state.shopsOrigin;
        const result = origin.filter(shop => shop.shop_location.match(e.target.value));
        this.setState({shops: result, search: e.target.value});
    }

    pickFilter(method) {
        const origin = this.state.shopsOrigin;
        let result = [];
        
        if (method === 'favorite') {
            if (this.state.userInfo === undefined) {
                return alert('먼저 로그인을 해주세요.')
            }
            this.setState({pickFavorite: !this.state.pickFavorite, pickRating: false, pickPromotion: false});
            result = this.state.pickFavorite ? origin : origin.filter(shop => this.props.favoriteList.indexOf(shop.shop_cd) !== -1);
        } else if (method === 'rating') {
            this.setState({pickFavorite: false, pickRating: !this.state.pickRating, pickPromotion: false});
            result = this.state.pickRating ? origin : origin.filter(shop => shop.ratings_ave > 4);
        } else if (method === 'promotion') {
            this.setState({pickFavorite: false, pickRating: false, pickPromotion: !this.state.pickPromotion});
            result = this.state.pickPromotion ? origin : origin.filter(shop => shop.ratings_ave > 4);
        }
        
        this.setState({shops: result})
    }
    
    Loading() {
        return(
            <Dimmer active inverted>
              <Loader size='large'>로딩중</Loader>
            </Dimmer>
          )
    }
    
    render(){
        const { pickFavorite, pickRating, pickPromotion, isLoading, perPage, activePage , shops, category, search } = this.state; 
        
        return(
            <div className='shopmodal-body'>
                
                <Menu.Item className="shopmodal-search">
                    <Link to={{
                        pathname:'/search',
                        state:{
                            category: category
                        }
                        }}>
                        <Input iconPosition='left' placeholder='위치 또는 매장명을 입력해주세요' value={search} onChange={this.handleChange}>
                            <Icon className='search-btn' name='search'/>
                            <input className='search-input'/>
                        </Input>
                    </Link>
                </Menu.Item>
                
                <div className="shopmodal-main">
                <h4 className='underline'>My Pick</h4>
                    <div className='shopmodal-pick-group'>
                        <Button basic={!pickFavorite} color={pickFavorite ? 'pink' : 'black'} className='shopmodal-pick' onClick={() => this.pickFilter('favorite')}>
                            <Icon name={pickFavorite ? 'like' : 'like outline'}/>즐겨찾기
                        </Button>
                        <Button basic={!pickRating} color={pickRating ? 'violet' : 'black'}  className='shopmodal-pick' onClick={() => this.pickFilter('rating')}>
                            <Icon name={pickRating ? 'thumbs up' : 'thumbs up outline'}/>고평가매장
                        </Button>
                        <Button basic={!pickPromotion} color={pickPromotion ? 'blue' : 'black'}  className='shopmodal-pick' onClick={() => this.pickFilter('promotion')}>
                            <Icon name={pickPromotion ? 'gem' : 'gem outline'}/>프로모션중
                        </Button>
                    </div>
                <h4 className='underline'>주변 매장</h4>
                    <div className='shopmodal-shops'>
                    {isLoading ? <this.Loading/> : 
                        shops === null ? <h3 className='booking-nodata'>해당하는 매장을 찾지 못했습니다</h3> :
                        shops.slice((activePage - 1) * perPage, (activePage * perPage)).map(shop => {
                        const shop_img = shop.shop_img === null ? 'images/shop/default.png' : shop.shop_img.split(',')[0];
                        return(
                            <Link to={`/booking/${category}/${shop.shop_cd}`}>
                                <button style={{backgroundPosition: 'center', backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.45)), url(' + api.imgRender(shop_img) + ')'}}>
                                    <div className='shopmodal-name'>
                                        {shop.shop_name}
                                    </div>
                                    <div className='shopmodal-location'>
                                        {shop.shop_location}
                                    </div>
                                    <span className='shopmodal-rating'><Icon name='star'/>{shop.ratings_ave}</span>
                                </button>
                            </Link>
                        ) 
                        })
                    }
                    </div>
                </div>
                <Pagination className='shopmodal-pagination' 
                    defaultActivePage={1} 
                    firstItem={null} 
                    lastItem={null} 
                    onPageChange={this.handlePaginationChange}
                    totalPages={Math.ceil(shops.length / perPage)}
                    pointing secondary
                />
            </div>
        )
    }
}