import { useState } from "react";
import { Link } from "react-router-dom";
import { Icon, Card, Menu, Label, Segment, Header, Button } from 'semantic-ui-react'
import { useHistory } from "react-router-dom";
import { Link as Scroll } from "react-scroll";
import * as api from '../../rest/api';

export default function MyFavorite(props) {

    let history = useHistory();
    const favoriteList = props.favoriteList;
    const cardRow = parseInt(window.innerWidth / 350);
    const shopDefault = 'images/shop/default.png';

    const [activeItem, setActiveItem] = useState('All');
    function handleItemClick(e, { name }) {
        let renderName = 'All'
        if (name === '헤어샵') {
            renderName = 'hairshop';
        } else if (name === '맛집') {
            renderName = 'restaurant';
        } else if (name === '카페') {
            renderName = 'cafe';
        }
        setActiveItem(renderName);
    };

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

        <Card.Group itemsPerRow={cardRow}>
            {favoriteList.length !== 0 ?
                activeItem === 'All' ?
                favoriteList.map(shop => 
                    <Card
                    image={api.imgRender(shop.shopImg === null ? shopDefault : shop.shopImg.split(",")[0])}
                    header={shop.shopName}
                    meta={shop.shopLocation}
                    color={shop.category === 'hairshop' ? 'violet' : shop.category === 'restaurant' ? 'teal' : 'blue'}
                    description={<Label className='mypage-favorite-label'><Icon name='archive'/>프로모션 진행중</Label>}
                    onClick={() => {history.push(`/booking/${shop.category}/${shop.shop_cd}`)}}
                    className='mypage-favorite-card'
                    />
                )
                :
                favoriteList.filter(shop => shop.category === activeItem).length !== 0 ?
                favoriteList.filter(shop => shop.category === activeItem).map(shop => 
                    <Card
                    image={api.imgRender(shop.shopImg === null ? shopDefault : shop.shopImg.split(",")[0])}
                    header={shop.shopName}
                    meta={shop.shopLocation}
                    color={shop.category === 'hairshop' ? 'violet' : shop.category === 'restaurant' ? 'teal' : 'blue'}
                    description={<Label className='mypage-favorite-label'><Icon name='archive'/>프로모션 진행중</Label>}
                    onClick={() => {history.push(`/booking/${shop.category}/${shop.shop_cd}`)}}
                    className='mypage-favorite-card'
                    />
                )
                :
                <Segment className='mypage-favorite-nodata' placeholder>
                    <Header icon>
                    <Icon name='file text outline'/>
                    해당 카테고리에 등록된 매장가 없습니다.
                    </Header>
                    <Link to='/booking/hairshop'>
                        <Button className='mypage-favorite-nodata-btn' secondary>둘러보기<Icon name='angle double right'/></Button>
                    </Link>
                </Segment>
            :
            <Segment className='mypage-favorite-nodata' placeholder>
                <Header icon>
                <Icon name='file text outline'/>
                아직 즐겨찾기에 등록된 매장가 없습니다.
                </Header>
                <Link to='/booking/hairshop'>
                    <Button className='mypage-favorite-nodata-btn' secondary>둘러보기<Icon name='angle double right'/></Button>
                </Link>
            </Segment>
            }
        </Card.Group>
        </>
    );
}