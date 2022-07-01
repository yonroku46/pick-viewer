import { useState } from "react";
import { Link } from "react-router-dom";
import { Icon, Card, Menu, Label, Segment, Header, Button, Dropdown } from 'semantic-ui-react'
import { useHistory } from "react-router-dom";
import { Link as Scroll } from "react-scroll";
import * as api from '../../rest/api';

export default function MyFavorite(props) {

    let history = useHistory();
    const favoriteList = props.favoriteList;
    const cardRow = parseInt(window.innerWidth / 350);
    const shopDefault = 'images/shop/default.png';

    const filterOptions = [
            {key: 'all', text: '전체보기', value: 'all'},
            {key: 'hairshop', text: '헤어샵', value: 'hairshop'},
            {key: 'restaurant', text: '맛집', value: 'restaurant'},
            {key: 'cafe', text: '카페', value: 'cafe'},
        ]

    const [activeItem, setActiveItem] = useState(filterOptions[0].value);
    
    function handleChange(e, { value }) {
        setActiveItem(value)
    }

    return (
        <>
        <div className='mypage-favorite-menu'>
            <Icon name={activeItem === 'all' ? 'folder outline' : 'folder open outline'}/>
            <Dropdown inline options={filterOptions} defaultValue={filterOptions[0].value} onChange={handleChange}/>
        </div>

        <Card.Group itemsPerRow={cardRow}>
            {favoriteList.length !== 0 ?
                activeItem === 'all' ?
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