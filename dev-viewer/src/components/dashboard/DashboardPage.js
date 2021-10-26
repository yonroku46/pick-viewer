import { useEffect, useState } from 'react';
import { Label, Image, Menu, Icon, Form, Segment, Input, TextArea, Header, Button, Table, List, Item, Select } from 'semantic-ui-react'
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

    const menuDefault = 'images/menu/default.png';

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

    function shopInfoView() {
        return (
            <>
            {shop.length !== 0 && <>
            <Label className='dashboard-viewer-title' attached='top'>
                <Icon name='cog'/>매장정보 수정/관리
            </Label>
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
                        <Image src={api.imgRender(shopDefault)}/>
                        <Image src={api.imgRender(shopDefault)}/>
                        <Image src={api.imgRender(shopDefault)}/>
                        <Image src={api.imgRender(shopDefault)}/>
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
                <Form.Field className='dashboard-content-final' control={TextArea} label='매장 소개' placeholder='매장 소개를 입력해보세요. (최대 100자)' value={shop.shop_info}/>
            </Form>
            <Label className='dashboard-viewer-btns' attached='bottom right'>
                {editMode ?
                <Button primary floated='right' onClick={() => setEditMode(false)}><Icon name='save'/>저장</Button>
                :
                <Button secondary floated='right' onClick={() => setEditMode(true)}><Icon name='edit'/>수정</Button>
                }
                <Button inverted color='violet' floated='right'><Icon name='eye'/>프리뷰</Button>
            </Label>
            </>}
            </>
        )
    }
    function staffInfoView() {
        return (
            <>
            <Label className='dashboard-viewer-title' attached='top'>
                <Icon name='cog'/>직원정보 수정/관리
            </Label>
            <Form className='dashboard-viewer-inline'>
                <Form.Field>
                    <label>직원 신쳥현황</label>
                    <List selection verticalAlign='middle'>
                        <List.Item>
                        <Image avatar src='https://react.semantic-ui.com/images/avatar/small/helen.jpg' />
                        <List.Content>
                            <List.Header>Helen</List.Header>
                        </List.Content>
                        </List.Item>
                        <List.Item>
                        <Image avatar src='https://react.semantic-ui.com/images/avatar/small/christian.jpg' />
                        <List.Content>
                            <List.Header>Christian</List.Header>
                        </List.Content>
                        </List.Item>
                        <List.Item>
                        <Image avatar src='https://react.semantic-ui.com/images/avatar/small/daniel.jpg' />
                        <List.Content>
                            <List.Header>Daniel</List.Header>
                        </List.Content>
                        </List.Item>
                    </List>
                </Form.Field>
                <Form.Field>
                    <label>직원 리스트</label>
                    <Input icon='search' className='dashboard-staff-search' placeholder='직원 검색'/>
                    <Table celled selectable>
                        <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>이름</Table.HeaderCell>
                            <Table.HeaderCell>경력</Table.HeaderCell>
                            <Table.HeaderCell>직원소개</Table.HeaderCell>
                        </Table.Row>
                        </Table.Header>

                        <Table.Body>
                        {shop.staff_list.map(staff => (
                            <Table.Row>
                                <Table.Cell>{staff.user_name}</Table.Cell>
                                <Table.Cell>{staff.career}</Table.Cell>
                                <Table.Cell>{staff.info}</Table.Cell>
                            </Table.Row>
                        ))
                        }
                        </Table.Body>
                    </Table>
                </Form.Field>
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
        )
    }
    function menuInfoView() {
        return (
            <>
            <Label className='dashboard-viewer-title' attached='top'>
                <Icon name='cog'/>메뉴정보 수정/관리
            </Label>
            <Form className='dashboard-viewer-inline'>
                <Form.Field>
                    <label>메뉴 리스트</label>

                    <Header as='h3' className='detailpage-service-header' dividing>
                        <Icon name='slack hash'/>
                        <Header.Content>{'카테고리명'}</Header.Content>
                    </Header>
                    {console.log(shop.menu_list)}
                    {shop.menu_list.map(menu => (
                    <Item.Group unstackable className='detailpage-service-menu' key={menu.menu_cd}>
                        <Item className='detailpage-service' onClick={() => {}}>
                            <Item.Image className='detailpage-service-img' src={api.imgRender(menu.menu_img === null ? menuDefault : menu.menu_img)}/>
                            <Item.Content header={menu.menu_name} meta={comma(menu.menu_price) + '원'} description={menu.menu_description}/>
                        </Item>
                    </Item.Group>
                    ))}
                    <div className='dashboard-content-final-empty'> </div>
                </Form.Field>
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
        )
    }

    function sampleView() {
        return(
            <>
            준비중입니다...
            </>
        )
    }

    function comma(number) {
        let num = number + ""; 
        let point = num.length % 3 ;
        let len = num.length; 
       
        let result = num.substring(0, point); 
        while (point < len) { 
            if (result != "") result += ","; 
            result += num.substring(point, point + 3); 
            point += 3; 
        } 
        return result;
    }

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
        <Segment className='dashboard-viewer'>
            {activeItem === 'shopInfo' && shopInfoView()}
            {activeItem === 'staffInfo' && staffInfoView()}
            {activeItem === 'menuInfo' && menuInfoView()}

            {activeItem === 'bookingInfo' && sampleView()}
            {activeItem === 'bookingData' && sampleView()}

            {activeItem === 'salesInfo' && sampleView()}

            {activeItem === 'system' && sampleView()}
            {activeItem === 'help' && sampleView()}
        </Segment>
    </div>
    </>
    )
  };