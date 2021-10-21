import { useEffect, useState } from "react";
import { Icon, Card, Menu, Label } from 'semantic-ui-react'
import { useHistory } from "react-router-dom";
import { Link as Scroll } from "react-scroll";
import * as api from '../../rest/server';
import axios from 'axios';

export default function Favorite(props) {

    let history = useHistory();
    const user_cd = props.user_cd;
    const [favoriteList, setFavoriteList] = useState([]);
    
    const [activeItem, setActiveItem] = useState('All');
    function handleItemClick(e, { name }) {
        var renderName = 'All'
        if (name === '헤어샵') {
            renderName = 'hairshop';
        } else if (name === '맛집') {
            renderName = 'restaurant';
        } else if (name === '카페') {
            renderName = 'cafe';
        }
        setActiveItem(renderName);
    };

    const shopDefault = 'images/shop/default.png';

    useEffect(() => {
        return new Promise(function(resolve, reject) {
          axios
            .get(api.favoriteList, {
                params: {
                  'user_cd': user_cd
                }
            })
            .then(response => resolve(response.data))
            .catch(error => reject(error.response))
        })
        .then(res => {
          if (res !== null) {
            setFavoriteList(res);
          }
        })
        .catch(err => {
          alert("현재 서버와의 연결이 원활하지 않습니다. 관리자에게 문의해주세요.");
        })
    }, [])

    return (
        <>
        <Menu pointing>
            <Scroll to='menu' offset={-56} spy={true} smooth={true}>
                <Menu.Item id='menu' name='All' active={activeItem === 'All'} onClick={handleItemClick}/>
            </Scroll>
            <Scroll to='menu' offset={-56} spy={true} smooth={true}>
                <Menu.Item id='menu' name='헤어샵' active={activeItem === 'hairshop'} onClick={handleItemClick}/>
            </Scroll>
            <Scroll to='menu' offset={-56} spy={true} smooth={true}>
                <Menu.Item id='menu' name='맛집' active={activeItem === 'restaurant'} onClick={handleItemClick}/>
            </Scroll>
            <Scroll to='menu' offset={-56} spy={true} smooth={true}>
                <Menu.Item id='menu' name='카페' active={activeItem === 'cafe'} onClick={handleItemClick}/>
            </Scroll>
        </Menu>

        <Card.Group itemsPerRow={3}>
            {favoriteList.length !== 0 ?
                activeItem !== 'All' ?
                favoriteList.filter(shop => shop.category === activeItem).map(shop => 
                    <Card
                    image={api.imgRender(shop.shop_img === null ? shopDefault : shop.shop_img)}
                    header={shop.shop_name}
                    meta={shop.shop_location}
                    color={shop.category === 'hairshop' ? 'violet' : shop.category === 'restaurant' ? 'teal' : 'blue'}
                    description={<Label className='mypage-favorite-label'><Icon name='archive'/>프로모션 진행중</Label>}
                    onClick={() => {history.push(`/booking/${shop.category}/${shop.shop_cd}`)}}
                    className='quick-card'
                    />
                )
                :
                favoriteList.map(shop => 
                    <Card
                    image={api.imgRender(shop.shop_img === null ? shopDefault : shop.shop_img)}
                    header={shop.shop_name}
                    meta={shop.shop_location}
                    color={shop.category === 'hairshop' ? 'violet' : shop.category === 'restaurant' ? 'teal' : 'blue'}
                    description={<Label className='mypage-favorite-label'><Icon name='archive'/>프로모션 진행중</Label>}
                    onClick={() => {history.push(`/booking/${shop.category}/${shop.shop_cd}`)}}
                    className='quick-card'
                    />
                )
            :
            <>
            즐겨찾기 없음
            </>
            }
        </Card.Group>
        </>
    );
}