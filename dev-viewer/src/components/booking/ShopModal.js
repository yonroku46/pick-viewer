import React, { Component } from 'react';
import * as api from '../../rest/server'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Menu, Input, Dimmer, Loader, Icon } from 'semantic-ui-react';

export default class ShopModal extends Component {

    state = {
        isLoading: false,
        shopsOrigin: [],
        shops: [],
        search: '',
        category: this.props.category
    }

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
        const result = origin.filter(shops => shops.shop_location.match(e.target.value));
        this.setState({shops: result, search: e.target.value});
    } 
    
    Loading(){
        return(
            <Dimmer active inverted>
              <Loader size='large'>로딩중</Loader>
            </Dimmer>
          )
    }
    
    render(){
        const { isLoading, shops, category, search } = this.state; 
        
        return(
            <div className='shopmodal-body'>
                
                <Menu.Item className="shopmodal-search">
                    <Input icon='search' placeholder='위치를 입력해주세요' value={search} onChange={this.handleChange}/>
                </Menu.Item>
                
                <div className="shopmodal-main">
                {isLoading ? <this.Loading/> : 
                    shops === null ? <h3 className='booking-nodata'>데이터를 찾지 못했습니다</h3> :
                    shops.map(shop => {
                    const shop_img = shop.shop_img === null ? 'images/shop/default.png' : shop.shop_img;
                    return(
                        <Link to={`/booking/${category}/${shop.shop_cd}`}>
                            <button key={shop.shop_cd} style={{backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.45)), url(' + api.imgRender(shop_img) + ')'}}>
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
        )
    }
}