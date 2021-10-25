import { useEffect, useState } from 'react';
import { Label, Image, Menu, Icon, Form, Segment, Input, TextArea, Header, Button } from 'semantic-ui-react'
import * as api from '../../rest/server'
import axios from 'axios';

export default function DashboardPage(props) {

    const isAuthorized = sessionStorage.getItem('isAuthorized');
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    const permission = userInfo ? userInfo.permission : null;
    if (isAuthorized === null) {
        props.history.goBack(1);
    }

    const [shop, setShop] = useState([]);
    const shop_cd = userInfo? userInfo.employment : null;
    const shopDefault = 'images/shop/default.png';

    const [menuVisible, setMenuVisible] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [activeItem, setActiveItem] = useState('inbox');
    function handleItemClick (e, { name }) {
        setActiveItem(name);
        window.innerWidth < 767 && setMenuVisible(false);
    }

    function copy(text) {
        if (!navigator.clipboard) {
            return alert("해당 브라우저에서 클립보드를 지원하지 않습니다.");
        }
        navigator.clipboard.writeText(text);
        alert("코드가 복사되었습니다.");
    }

    useEffect(() => {
        if (permission !== 3) {
            props.history.goBack(1);
        }
        const params = { 
          'shop_cd': shop_cd,
          'permission': permission
        };
        return new Promise(function(resolve, reject) {
          axios
            .post(api.shopInfo, params)
            .then(response => resolve(response.data))
            .catch(error => reject(error.response))
        })
        .then(res => {
          if (res !== null) {
            setShop(res);
          }
        })
        .catch(err => {
          alert("현재 서버와의 연결이 원활하지 않습니다. 관리자에게 문의해주세요.");
        })
      }, [])

    return(
    <>
    <div className="dashboard-main">
        {menuVisible ?
        <Menu size='big' className='dashboard-menu' vertical>
            <Menu.Header><Icon name='table'/> 매장관리</Menu.Header>
            <Menu.Menu>
                <Menu.Item name='shopInfo' active={activeItem === 'shopInfo'} onClick={handleItemClick}>
                    - 매장정보
                </Menu.Item>
                <Menu.Item name='staffInfo' active={activeItem === 'staffInfo'} onClick={handleItemClick}>
                    - 직원정보
                </Menu.Item>
                <Menu.Item name='menuInfo' active={activeItem === 'menuInfo'} onClick={handleItemClick}>
                    - 메뉴정보
                </Menu.Item>
            </Menu.Menu>
            <Menu.Header><Icon name='tasks'/> 예약관리</Menu.Header>
            <Menu.Menu>
                <Menu.Item name='bookingInfo' active={activeItem === 'bookingInfo'} onClick={handleItemClick}>
                    - 예약정보
                </Menu.Item>
                <Menu.Item name='bookingData' active={activeItem === 'bookingData'} onClick={handleItemClick}>
                    - 예약통계
                </Menu.Item>
            </Menu.Menu>
            <Menu.Header><Icon name='chart line'/> 매출관리</Menu.Header>
            <Menu.Menu>
                <Menu.Item name='salesInfo' active={activeItem === 'salesInfo'} onClick={handleItemClick}>
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
            <Menu.Item className='dashboard-menu-fold' onClick={() => {setMenuVisible(true)}}>
                <Icon size='large' name='angle double down'/>
            </Menu.Item>
        </Menu.Menu>
        }
        <div className='dashboard-viewer'>
            <Segment className='dashboard-viewer-back'>

                {activeItem === 'shopInfo' &&
                <>
                <Header as='h3' icon='cog' content='매장정보 수정/관리'/>
                <Form className='dashboard-viewer-inline'>
                    <Form.Field>
                        <label>매장명</label>
                        <Header className='dashboard-shopinfo-name'>{shop.shop_name}</Header>
                    </Form.Field>

                    <Form.Field>
                        <label>매장코드</label>
                        <Header className='dashboard-shopinfo-name'>{shop.shop_serial}
                            <Icon className='dashboard-share-btn' name='share square' onClick={() => copy(shop.shop_serial)}/>
                        </Header>
                    </Form.Field>

                     <Form.Field>
                        <label>매장 사진</label>
                        <Image.Group size='small'>
                            <Image src={api.imgRender(shopDefault)} />
                            <Image src={api.imgRender(shopDefault)} />
                            <Image src={api.imgRender(shopDefault)} />
                            <Image src={api.imgRender(shopDefault)} />
                        </Image.Group>
                    </Form.Field>
       
                    <Form.Group>
                        <Form.Field>
                            <label>매장 전화번호</label>
                            <Input className='dashboard-shopinfo-tel' placeholder='000' value={shop.shop_tel.split('-')[0]}/>
                            <Input className='dashboard-shopinfo-tel' placeholder='000' value={shop.shop_tel.split('-')[1]}/>
                            <Input className='dashboard-shopinfo-tel' placeholder='0000' value={shop.shop_tel.split('-')[2]}/>
                        </Form.Field>
                    </Form.Group>
            
                    <Form.Group widths='equal'>
                        <Form.Select className='dashboard-shopinfo-hours' label='오픈시간' placeholder='09:00' value={shop.shop_open}/>
                        <Form.Select className='dashboard-shopinfo-hours' label='마감시간' placeholder='18:00' value={shop.shop_close}/>
                    </Form.Group>

                    <Form.Field control={TextArea} label='매장 소개' placeholder='매장 소개를 입력해보세요. (최대 100자)' value={shop.shop_info}/>

                </Form>
                <Label className='dashboard-viewer-btns' attached='bottom right'>
                    {editMode ?
                    <Button primary floated='right' onClick={() => setEditMode(false)}><Icon name='save'/>저장</Button>
                    :
                    <Button secondary floated='right' onClick={() => setEditMode(true)}><Icon name='edit'/>수정</Button>
                    }
                    <Button inverted color='violet' floated='right'><Icon name='eye'/>프리뷰</Button>
                </Label>
                </>
                }

            </Segment>
        </div>
    </div>
    </>
    )
  };