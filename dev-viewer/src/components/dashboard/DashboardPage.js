import { useState } from 'react';
import { Label, Image, Menu, Icon, Grid, Segment } from 'semantic-ui-react'
import * as api from '../../rest/server'
import axios from 'axios';

export default function DashboardPage() {

    const [menuVisible, setMenuVisible] = useState(true);
    const [activeItem, setActiveItem] = useState('inbox');
    function handleItemClick (e, { name }) {
        setActiveItem(name);
        window.innerWidth < 767 && setMenuVisible(false);
    }

    return(
    <>
    <div className="dashboard-main">
        {menuVisible ?
        <Menu size='big' className='dashboard-menu' vertical>
            <Menu.Header><Icon name='table'/> 매장관리</Menu.Header>
            <Menu.Menu>
                <Menu.Item name='shop' active={activeItem === 'shop'} onClick={handleItemClick}>
                    - 매장정보
                </Menu.Item>
                <Menu.Item name='staff' active={activeItem === 'staff'} onClick={handleItemClick}>
                    - 직원정보
                </Menu.Item>
                <Menu.Item name='menu' active={activeItem === 'menu'} onClick={handleItemClick}>
                    - 메뉴정보
                </Menu.Item>
            </Menu.Menu>
            <Menu.Header><Icon name='tasks'/> 예약관리</Menu.Header>
            <Menu.Menu>
                <Menu.Item name='booking' active={activeItem === 'booking'} onClick={handleItemClick}>
                    - 예약정보
                </Menu.Item>
                <Menu.Item name='bookingData' active={activeItem === 'bookingData'} onClick={handleItemClick}>
                    - 예약통계
                </Menu.Item>
            </Menu.Menu>
            <Menu.Header><Icon name='chart line'/> 매출관리</Menu.Header>
            <Menu.Menu>
                <Menu.Item name='sales' active={activeItem === 'sales'} onClick={handleItemClick}>
                    - 매출정보
                </Menu.Item>
            </Menu.Menu>
            <Menu.Header><Icon name='question circle outline'/> 기타</Menu.Header>
            <Menu.Menu>
                <Menu.Item name='system' active={activeItem === 'system'} onClick={handleItemClick}>
                    - 시스템문의
                </Menu.Item>
                <Menu.Item name='help' active={activeItem === 'help'} onClick={handleItemClick}>
                    - 도움말
                </Menu.Item>
            </Menu.Menu>
        </Menu>
        :
        <Menu.Menu size='big' className='dashboard-menu' vertical>
            <Menu.Item onClick={() => {setMenuVisible(true)}}>
                <Icon name='angle double down'/>
            </Menu.Item>
        </Menu.Menu>
        }
        <div className='dashboard-viewer'>
            <Segment>
                viewer
            </Segment>
        </div>
    </div>
    </>
    )
  };