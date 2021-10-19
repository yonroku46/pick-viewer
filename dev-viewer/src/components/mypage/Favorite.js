import {useState} from 'react';
import { Segment, Menu } from 'semantic-ui-react'

export default function Favorite() {

    const [activeItem, setActiveItem] = useState('전체보기');
    const handleItemClick = (e, { name }) => setActiveItem(name);

    return (
        <>
        <Menu tabular>
            <Menu.Item
            name='전체보기'
            active={activeItem === '전체보기'}
            onClick={handleItemClick}
            />
            <Menu.Item
            name='미용실'
            active={activeItem === '미용실'}
            onClick={handleItemClick}
            />
            <Menu.Item
            name='식당'
            active={activeItem === '식당'}
            onClick={handleItemClick}
            />
            <Menu.Item
            name='카페'
            active={activeItem === '카페'}
            onClick={handleItemClick}
            />
        </Menu>
        <Segment>
          가게 리스트
        </Segment>
        </>
    );
}