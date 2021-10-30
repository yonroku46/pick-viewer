import { useEffect, useState } from 'react';
import { Label, Image, Menu, Icon, Form, Segment, Input, TextArea, Header, Button, Table, List, Item, Dimmer, Loader, Select } from 'semantic-ui-react'
import * as api from '../../rest/server'
import moment from 'moment';
import axios from 'axios';

export default function DashboardPage(props) {

    const isAuthorized = sessionStorage.getItem('isAuthorized');
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    const permission = userInfo ? userInfo.permission : null;
    if (isAuthorized === null) {
        props.history.goBack(1);
    }

    const [reload, setReload] = useState(0);
    const [loading, setLoading] = useState(false);

    const [shop, setShop] = useState([]);
    const [requestList, setRequestList] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [menuList, setMenuList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const shop_cd = userInfo ? userInfo.employment : null;

    const shopDefault = 'images/shop/default.png';
    const menuDefault = 'images/menu/default.png';
    const userimgDefault =  'images/user/default.png';

    const [menuVisible, setMenuVisible] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [activeItem, setActiveItem] = useState('shopInfo');

    function handleItemClick (e, { name }) {
        setActiveItem(name);
        window.innerWidth < 767 && setMenuVisible(false);
    }

    const hours = [];
    new Array(24).fill().forEach((acc, index) => {
        const time = moment( {hour: index} ).format('HH:mm');
        hours.push({ key: time, value: time, text: time });
        // hours.push(moment({ hour: index, minute: 30 }).format('HH:mm'));
    })
    const startHour = 9;
    const endHour = 24;

    for (let i = 0; i < startHour; i++) {
        hours.shift()
    }
    for (let i = 0; i <  23 - endHour; i++) {
        hours.pop()
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
        setLoading(true);
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
            setStaffList(res.staff_list);
            setMenuList(res.menu_list);
            makeCategoryList(res.menu_categorys);
            getRequestList(shop_cd);
          }
        })
        .catch(err => {
          alert("현재 서버와의 연결이 원활하지 않습니다. 관리자에게 문의해주세요.");
          setLoading(false);
        })
      }, [reload])
    
    function makeCategoryList(menu_categorys) {
        const result = [];
        result.push({ key: 'All', value: 'All', text: '전체선택' });
        menu_categorys.map(category => {
            result.push({ key: category, value: category, text: category });
        });
        setCategoryList(result);
    }
    
    function getRequestList(shop_cd) {
        return new Promise(function(resolve, reject) {
          axios
            .get(api.shopRequestList, {
              params: {
                'shop_cd': shop_cd
              }
            })
            .then(response => resolve(response.data))
            .catch(error => reject(error.response))
        })
        .then(res => {
          if (res !== null) {
            setRequestList(res);
            setLoading(false);
          }
        })
        .catch(err => {
          alert("현재 서버와의 연결이 원활하지 않습니다. 관리자에게 문의해주세요.");
          setLoading(false);
        })
    }

    function changeTel(e, { tabIndex }) {
        const shop_tel = shop.shop_tel.split('-');
        shop_tel[tabIndex] = e.target.value.replace(/[^0-9]/g, '');
        setShop(
            { ...shop, shop_tel: shop_tel[0] + '-' + shop_tel[1] + '-' + shop_tel[2] }
        );
    }
    function changeOpen(e, { value }) {
        setShop(
            { ...shop, shop_open: value }
        );
    }
    function changeClose(e, { value }) {
        setShop(
            { ...shop, shop_close: value }
        );
    }
    function changeShopInfo(e) {
        setShop(
            { ...shop, shop_info: e.target.value }
        );
    }
    function changeCareer(e, { tabIndex }) {
        setStaffList(
            staffList.map(
                staff => staff.user_cd === tabIndex
                ? { ...staff, career: e.target.value }
                : staff
            )
        );
        setShop(
            { ...shop, staff_list: shop.staff_list.map(
                staff => staff.user_cd === tabIndex
                ? { ...staff, career: e.target.value }
                : staff
            ) }
        );
    }
    function changeInfo(e, { tabIndex }) {
        setStaffList(
            staffList.map(
                staff => staff.user_cd === tabIndex
                ? { ...staff, info: e.target.value }
                : staff
            )
        );
        setShop(
            { ...shop, staff_list: shop.staff_list.map(
                staff => staff.user_cd === tabIndex
                ? { ...staff, info: e.target.value }
                : staff
            ) }
        );
    }
    function changeMenuName(e, { tabIndex }) {
        setMenuList(
            menuList.map(
                menu => menu.menu_cd === tabIndex
                ? { ...menu, menu_name: e.target.value }
                : menu
            )
        );
        setShop(
            { ...shop, menu_list: shop.menu_list.map(
                menu => menu.menu_cd === tabIndex
                ? { ...menu, menu_name: e.target.value }
                : menu
            ) }
        );
    }
    function changeMenuPrice(e, { tabIndex }) {
        setMenuList(
            menuList.map(
                menu => menu.menu_cd === tabIndex
                ? { ...menu, menu_price: e.target.value.replace(/[^0-9]/g, '') }
                : menu
            )
        );
        setShop(
            { ...shop, menu_list: shop.menu_list.map(
                menu => menu.menu_cd === tabIndex
                ? { ...menu, menu_price: e.target.value.replace(/[^0-9]/g, '') }
                : menu
            ) }
        );
    }
    function changeMenuDescription(e, { tabIndex }) {
        setMenuList(
            menuList.map(
                menu => menu.menu_cd === tabIndex
                ? { ...menu, menu_description: e.target.value }
                : menu
            )
        );
        setShop(
            { ...shop, menu_list: shop.menu_list.map(
                menu => menu.menu_cd === tabIndex
                ? { ...menu, menu_description: e.target.value }
                : menu
            ) }
        );
    }

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
                    <Header className='dashboard-shopinfo-text'>{shop.shop_name}</Header>
                </Form.Field>
                <Form.Field>
                    <label>매장코드</label>
                    <Header className='dashboard-shopinfo-text'>{shop.shop_serial}
                        <Icon className='dashboard-share-btn' name='share square' onClick={() => copy(shop.shop_serial)}/>
                    </Header>
                </Form.Field>
                <Form.Field>
                    <label>매장 사진</label>
                    <Image.Group className='dashboard-viewer-imgs' size='small'>
                        <Image label={editMode && { color: 'blue', size: 'mini', corner: 'right', icon: 'move' }} src={api.imgRender(shop.shop_img)}/>
                        <Image label={editMode && { color: 'grey', size: 'mini', corner: 'right', icon: 'move' }} src={api.imgRender(shopDefault)}/>
                        <Image label={editMode && { color: 'grey', size: 'mini', corner: 'right', icon: 'move' }} src={api.imgRender(shopDefault)}/>
                        <Image label={editMode && { color: 'grey', size: 'mini', corner: 'right', icon: 'move' }} src={api.imgRender(shopDefault)}/>
                    </Image.Group>
                </Form.Field>
                <Form.Group  widths='equal'>
                    <Form.Field>
                        <label>매장 전화번호</label>
                        {editMode ? 
                        <>
                        <Input className='dashboard-shopinfo-tel' placeholder='000' value={shop.shop_tel.split('-')[0]} tabIndex='0' onChange={changeTel}/>
                        <Input className='dashboard-shopinfo-tel' placeholder='000' value={shop.shop_tel.split('-')[1]} tabIndex='1' onChange={changeTel}/>
                        <Input className='dashboard-shopinfo-tel' placeholder='0000' value={shop.shop_tel.split('-')[2]} tabIndex='2' onChange={changeTel}/>
                        </>
                        :
                        <Header className='dashboard-shopinfo-text'>{shop.shop_tel.length === 2 ? <span className='empty'>전화번호 미입력</span> : shop.shop_tel}</Header>
                        }
                    </Form.Field>
                </Form.Group>
                <Form.Group widths='equal'>
                    {editMode ? 
                    <>
                    <Form.Select className='dashboard-shopinfo-hours' label='오픈시간' placeholder='09:00' value={shop.shop_open} options={hours} onChange={changeOpen}/>
                    <Form.Select className='dashboard-shopinfo-hours' label='마감시간' placeholder='18:00' value={shop.shop_close} options={hours} onChange={changeClose}/>
                    </>
                    :
                    <Form.Field>
                        <label>매장 운영시간</label>
                        <Header className='dashboard-shopinfo-text'>{shop.shop_open} ~ {shop.shop_close}</Header>
                    </Form.Field>
                    }
                </Form.Group>
                {editMode ? 
                <Form.Field className='dashboard-content-final' control={TextArea} label='매장 소개' placeholder='매장 소개를 입력해보세요. (최대 100자)' value={shop.shop_info} onChange={changeShopInfo}/>
                :
                <Form.Field>
                    <label>매장 소개</label>
                    <Header as='h4' className='dashboard-shopinfo-text'>{shop.shop_info}</Header>
                </Form.Field>
                }
                <div className='dashboard-content-final-empty'> </div>
            </Form>
            <Label className='dashboard-viewer-btns' attached='bottom right'>
                {editMode ?
                <>
                <Button inverted color='blue' floated='right' onClick={() => setEditMode(false)}><Icon name='save'/>임시저장</Button>
                <Button color='blue' floated='right' onClick={() => setEditMode(false)}><Icon name='cloud upload'/>저장</Button>
                </>
                :
                <>
                <Button color='violet' floated='right' onClick={() => setEditMode(true)}><Icon name='edit'/>수정</Button>
                <Button inverted color='violet' floated='right'><Icon name='eye'/>프리뷰</Button>
                </>
                }
            </Label>
            </>}
            </>
        )
    }
    function staffInfoView() {
        return (
            <>
            {shop.length !== 0 && <>
            <Label className='dashboard-viewer-title' attached='top'>
                <Icon name='cog'/>직원정보 수정/관리
            </Label>
            <Form className='dashboard-viewer-inline'>
                <Form.Field>
                    <label>총 직원수</label>
                    <Header className='dashboard-shopinfo-text'>{shop.staff_list.length + '명'}</Header>
                </Form.Field>
                <Form.Field>
                    <label>직원 신쳥현황</label>
                    {requestList.length !== 0 ?
                    <List selection verticalAlign='middle'>
                        {requestList.map(request => (
                            <List.Item>
                                <Image className="user-icon" src={api.imgRender(request.user_img === null ? userimgDefault : request.user_img)}/>
                                <List.Content>
                                    <List.Header>
                                        {request.user_name}
                                        <span className='dashboard-viewer-email'>{request.user_email}</span>
                                    </List.Header>
                                </List.Content>
                                <List.Content floated='right'>
                                    <Button inverted color='red' onClick={() => requestConfirm(2, request.request_cd)}>거절</Button>
                                    <Button inverted color='green' onClick={() => requestConfirm(1, request.request_cd)}>승인</Button>
                                </List.Content>
                            </List.Item>
                        ))}
                    </List>
                    : 
                    <Header className='dashboard-shopinfo-text'>
                        신청목록 없음
                    </Header>
                    }
                </Form.Field>
                <Form.Field>
                    <label>직원 리스트</label>
                    <Input icon='search' className='dashboard-staff-search' placeholder='직원명으로 검색' onChange={staffSearch}/>
                    <Table celled unstackable selectable className='dashboard-table'>
                        <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell className='dashboard-table-name'>이름</Table.HeaderCell>
                            <Table.HeaderCell className='dashboard-table-career'>경력/직급</Table.HeaderCell>
                            <Table.HeaderCell className='dashboard-table-info' colSpan={editMode && '2'}>직원소개</Table.HeaderCell>
                        </Table.Row>
                        </Table.Header>

                        <Table.Body>
                        {staffList.length !== 0 ?
                            staffList.map(staff => (
                                <Table.Row key={staff.user_cd}>
                                    <Table.Cell className='dashboard-table-name'>
                                        {staff.user_name}
                                    </Table.Cell>
                                    <Table.Cell className={editMode ? 'dashboard-table-career edit-input' : 'dashboard-table-career'}>
                                        {editMode ? 
                                        <Input placeholder={staff.career} value={staff.career} tabIndex={staff.user_cd} onChange={changeCareer}/>
                                        :
                                        staff.career ? staff.career : <span className='empty'>미입력</span>
                                        }
                                    </Table.Cell>
                                    <Table.Cell className={editMode ? 'dashboard-table-info edit-input' : 'dashboard-table-info'}>
                                        {editMode ? 
                                        <Input placeholder={staff.info} value={staff.info} tabIndex={staff.user_cd} onChange={changeInfo}/>
                                        :
                                        staff.info ? staff.info : <span className='empty'>미입력</span>
                                        }
                                    </Table.Cell>
                                    {editMode &&
                                    <Table.Cell className='dashboard-table-delete'>
                                        <Icon name='x' onClick={() => staffInfoManage('delete', staff.user_cd)}/>
                                    </Table.Cell>
                                    }
                                </Table.Row>
                            ))
                            :
                            <Table.Row>
                                <Table.Cell colSpan='3'>찾으시는 직원이 없습니다</Table.Cell>
                            </Table.Row>
                        }
                        </Table.Body>
                    </Table>
                    <div className='dashboard-content-final-empty'> </div>
                </Form.Field>
            </Form>
            <Label className='dashboard-viewer-btns' attached='bottom right'>
                {editMode ?
                <>
                <Button inverted color='blue' floated='right' onClick={() => setEditMode(false)}><Icon name='save'/>임시저장</Button>
                <Button color='blue' floated='right' onClick={() => setEditMode(false)}><Icon name='cloud upload'/>저장</Button>
                </>
                :
                <>
                <Button color='violet' floated='right' onClick={() => setEditMode(true)}><Icon name='edit'/>수정</Button>
                <Button inverted color='violet' floated='right'><Icon name='eye'/>프리뷰</Button>
                </>
                }
            </Label>
            </>}
            </>
        )
    }
    function menuInfoView() {
        return (
            <>
            {shop.length !== 0 && <>
            <Label className='dashboard-viewer-title' attached='top'>
                <Icon name='cog'/>메뉴정보 수정/관리
            </Label>
            <Form className='dashboard-viewer-inline'>
                <Form.Field>
                    <label>메뉴 리스트</label>
                    <Select className='dashboard-viewer-category' placeholder='전체선택' options={categoryList} onChange={selectCategory}/>
                    {menuList.map(menu => (
                    <Item.Group unstackable className='dashboard-viewer-menu' key={menu.menu_cd}>
                        <Item className='detailpage-service' onClick={() => {}}>
                            <Item.Image className='detailpage-service-img' src={api.imgRender(menu.menu_img === null ? menuDefault : menu.menu_img)}/>
                            <Item.Content className={editMode && 'dashboard-viewer-edit-content'}
                                header= 
                                    {editMode 
                                    ? <Input placeholder='메뉴 이름' value={menu.menu_name} tabIndex={menu.menu_cd} onChange={changeMenuName}/> 
                                    : menu.menu_name
                                    }
                                meta=
                                    {editMode
                                    ? <Input placeholder='메뉴 가격' value={menu.menu_price} tabIndex={menu.menu_cd} onChange={changeMenuPrice}/> 
                                    : comma(menu.menu_price) + '원'
                                    }
                                description=
                                    {editMode
                                    ? <TextArea placeholder='메뉴 설명' value={menu.menu_description} tabIndex={menu.menu_cd} onChange={changeMenuDescription}/>
                                    : menu.menu_description ? menu.menu_description : <span className='empty'>설명 미입력</span>
                                    }
                            />
                            {editMode && <Item className='dashboard-content-delete'><Icon name='x'/></Item>}
                        </Item>
                    </Item.Group>
                    ))}
                    <div className='dashboard-content-final-empty'> </div>
                </Form.Field>
            </Form>
            <Label className='dashboard-viewer-btns' attached='bottom right'>
                {editMode ?
                <>
                <Button inverted color='blue' floated='right' onClick={() => setEditMode(false)}><Icon name='save'/>임시저장</Button>
                <Button color='blue' floated='right' onClick={() => setEditMode(false)}><Icon name='cloud upload'/>저장</Button>
                </>
                :
                <>
                <Button color='violet' floated='right' onClick={() => setEditMode(true)}><Icon name='edit'/>수정</Button>
                <Button inverted color='violet' floated='right'><Icon name='eye'/>프리뷰</Button>
                </>
                }
            </Label>
            </>}
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

    function Loading() {
        return(
            <Dimmer active inverted>
              <Loader size='large'>로딩중</Loader>
            </Dimmer>
          )
    }

    function staffSearch(e) {
        const result = shop.staff_list.filter(staff => staff.user_name.match(e.target.value));
        setStaffList(result);
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

    function selectCategory (e, { value }) {
        if (value === 'All') {
            setMenuList(shop.menu_list);
        } else {
            const result = shop.menu_list.filter(menu => menu.menu_category === value);
            setMenuList(result);
        }
    }

    // function dragStart(e) {
    //     this.dragged = e.currentTarget; e.dataTransfer.effectAllowed = 'move';
    //     e.dataTransfer.setData('text/html', this.dragged);
    // } 
    // function dragEnd(e) {
    //     this.dragged.style.display = 'block';
    //     this.dragged.parentNode.removeChild(placeholder);

    //     // update state
    //     var data = this.state.colors;
    //     var from = Number(this.dragged.dataset.id);
    //     var to = Number(this.over.dataset.id);
    //     if (from < to) to--;
    //     data.splice(to, 0, data.splice(from, 1)[0]);
    //     this.setState({colors: data});
    // }
    // function dragOver(e) {
    //     e.preventDefault();
    //     this.dragged.style.display = "none";
    //     if (e.target.className === 'placeholder') return;
    //     this.over = e.target;
    //     e.target.parentNode.insertBefore(placeholder, e.target);
    // }


    function requestConfirm(request_stat, targetId) {
        const target = requestList.find(request => request.request_cd === targetId);
        const params = { 
            'shop_cd': shop_cd,
            'user_cd': target.user_cd,
            'request_cd': target.request_cd,
            'request_stat': request_stat
        };
        return new Promise(function(resolve, reject) {
        axios
            .post(api.userRequestConfirm, params)
            .then(response => resolve(response.data))
            .catch(error => reject(error.response))
        })
        .then(res => {
        if (res) {
            alert("처리가 완료되었습니다.");
            setReload(reload + 1);
        }
        })
        .catch(err => {
        alert("현재 서버와의 연결이 원활하지 않습니다. 관리자에게 문의해주세요.");
        })
    }

    function staffInfoManage(methods, targetId) {
        const target = shop.staff_list.find(staff => staff.user_cd === targetId);
        const additional = {
            'career': target.career,
            'info': target.info
        }
        const params = { 
            'shop_cd': shop_cd,
            'user_cd': target.user_cd,
            'additional': additional,
            'methods': methods
        };
        return new Promise(function(resolve, reject) {
        axios
            .post(api.staffInfoManage, params)
            .then(response => resolve(response.data))
            .catch(error => reject(error.response))
        })
        .then(res => {
        if (res) {
            alert("처리가 완료되었습니다.");
            setReload(reload + 1);
        }
        })
        .catch(err => {
        alert("현재 서버와의 연결이 원활하지 않습니다. 관리자에게 문의해주세요.");
        })
    }

    return(
    <>
    <div className="dashboard-main">
        <Menu size='big' className='dashboard-menu' vertical>
        {menuVisible ?
            <>
            <Menu.Header className='dashboard-menu-fold' onClick={() => {setMenuVisible(false)}}>
                <Icon name='angle double up'/>
            </Menu.Header>
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
            </>
            :
            <>
            <Menu.Header className='dashboard-menu-fold' onClick={() => {setMenuVisible(true)}}>
                <Icon name='angle double down'/>
            </Menu.Header>
            </>
        }
        </Menu>
        <Segment className='dashboard-viewer'>
            {loading ? 
            <Loading/>
            :
            <>
            {activeItem === 'shopInfo' && shopInfoView()}
            {activeItem === 'staffInfo' && staffInfoView()}
            {activeItem === 'menuInfo' && menuInfoView()}

            {activeItem === 'bookingInfo' && sampleView()}
            {activeItem === 'bookingData' && sampleView()}

            {activeItem === 'salesInfo' && sampleView()}

            {activeItem === 'system' && sampleView()}
            {activeItem === 'help' && sampleView()}
            </>
            }
        </Segment>
    </div>
    </>
    )
  };