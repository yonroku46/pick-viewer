import { useEffect, useState, useRef } from 'react';
import { Label, Modal, Image, Menu, Icon, Dropdown, Form, Segment, Input, TextArea, Header, Button, Table, List, Item, Dimmer, Loader, Select, Progress, Popup } from 'semantic-ui-react'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import * as api from '../../rest/server'
import MapContainer from "../booking/MapContainer";
import BookingInfo from "./BookingInfo";
import BookingData from "./BookingData";
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
    const [open, setOpen] = useState(false);

    const [count, setCount] = useState(0);
    const [locationSearch, setLocationSearch] = useState(null);
    const [shop, setShop] = useState([]);
    const [shopOrigin, setShopOrigin] = useState([]);
    const [requestList, setRequestList] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [menuList, setMenuList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [modalMenu, setModalMenu] = useState(null);
    const [modalCategoryList, setModalCategoryList] = useState([]);
    const [shopImages, setShopImages] = useState([]);
    const [shopImageIndex, setShopImageIndex] = useState([]);
    const shop_cd = userInfo ? userInfo.employment : null;
    
    const [category, setCategory] = useState('all');
    const [searchValue, setSearchValue] = useState('');
    const inputRef = useRef(null);

    const fileType=['image/png','image/jpg','image/jpeg'];
    const shopDefault = 'images/shop/default.png';
    const menuDefault = 'images/menu/default.png';
    const userimgDefault =  'images/user/default.png';
    const sampleImg = 'https://react.semantic-ui.com/images/wireframe/image.png';

    const [menuVisible, setMenuVisible] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [activeItem, setActiveItem] = useState('shopInfo');

    function handleItemClick (e, { name }) {
        setActiveItem(name);
        window.innerWidth < 767 && setMenuVisible(false);
    }

    const weeks = [
        { key: 'none', value: 'none', text: '휴무없음' },
        { key: 'mon', value: 'mon', text: '월요일' },
        { key: 'tue', value: 'tue', text: '화요일' },
        { key: 'wed', value: 'wed', text: '수요일' },
        { key: 'thu', value: 'thu', text: '목요일' },
        { key: 'fri', value: 'fri', text: '금요일' },
        { key: 'sat', value: 'sat', text: '토요일' },
        { key: 'sun', value: 'sun', text: '일요일' },
    ];

    const hours = [];
    new Array(24).fill().forEach((acc, index) => {
        const time = moment( {hour: index} ).format('HH:mm');
        hours.push({ key: time, value: time, text: time });
        // hours.push(moment({ hour: index, minute: 30 }).format('HH:mm'));
    })
    const startHour = 9;
    const endHour = 24;

    for (let i = 0; i < startHour; i++) {
        hours.shift();
    }
    for (let i = 0; i <  23 - endHour; i++) {
        hours.pop();
    }

    function copy(text) {
        if (!navigator.clipboard) {
            return alert("해당 브라우저에서 클립보드를 지원하지 않습니다.");
        }
        navigator.clipboard.writeText(text);
        alert("코드가 복사되었습니다.");
    }

    function mobileCheck() {
        if ( window.innerWidth < 767) {
            alert("원활한 사용을 위해, 정보수정은 PC 또는 태블릿을 이용 바랍니다.");
        }
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
            setShopOrigin(JSON.parse(JSON.stringify(res)));
            setStaffList(res.staff_list);
            setMenuList(res.menu_list);
            makeCategoryList(res.menu_categorys);
            makeImageList(res.shop_img);
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
        const modalResult = [];
        result.push({ key: 'all', value: 'all', text: '전체선택' });
        modalResult.push({ key: 'direct', value: 'direct', text: '직접입력' });
        menu_categorys.map(category => {
            result.push({ key: category, value: category, text: category });
            modalResult.push({ key: category, value: category, text: category });
        });
        setCategoryList(result);
        setModalCategoryList(modalResult);
    }

    function makeImageList(shop_img) {
        const result = [];
        for (let index = 0; index < 4; index++) {
            result.push({ id: (index + 1).toString(), img: shop_img[index] ? shop_img[index] : shopDefault });
        }
        setShopImages(result);
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

    function handleChange(result) {
        if (!result.destination) {
            return;
        }
        const items = [...shopImages];
        const shopImg = [];
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        items.map(item => {
            shopImg.push(item.img)
        });
        setShop(
            { ...shop, shop_img: shopImg }
        );
        setShopImages(items);
    };

    function changeLocation(e) {
        setShop(
            { ...shop, shop_location: e.target.value }
        );
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
    function changeHoliday(e, { value }) {
        setShop(
            { ...shop, shop_holiday: value }
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
            )}
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
            )}
        );
    }
    function changeMenuCategory(e) {
        setModalMenu(
            { ...modalMenu, menu_category: e.target.value.replace(/[\'\"\=]/gi, '') }
        );
    }
    function changeMenuName(e) {
        setModalMenu(
            { ...modalMenu, menu_name: e.target.value.replace(/[ \{\}\[\]\/?.,;:|\)*~`!^\-_+┼<>@\#$%&\'\"\\\(\=]/gi, '') }
        );
    }
    function changeMenuPrice(e) {
        setModalMenu(
            { ...modalMenu, menu_price: e.target.value.replace(/[^0-9]/g, '') }
        );
    }
    function changeMenuDescription(e) {
        setModalMenu(
            { ...modalMenu, menu_description: e.target.value.replace(/[ \{\}\[\]\/?.,;:|\)*~`!^\-_+┼<>@\#$%&\'\"\\\(\=]/gi, '') }
        );
    }

    function setImg(e) {
        setShopImageIndex(e.target.id);
        inputRef.current.click();
    };
    
    function shopImgUpload(e) {
        if (e.target.files[0] === undefined) {
            return;
        }
        const file = e.target.files[0];
        const img_index = shopImageIndex;
        if (fileType.indexOf(file.type) !== -1) {
          const params = new FormData();
          params.append('file', file);
          params.append('shop_cd', shop_cd);
          params.append('img_index', img_index);
          params.append('call', 'shop');
          axios
            .post(api.imgUpload, params)
            .then((res) => {
                if (res) {
                    const target = shopImages.find(image => image.id === img_index)
                    target.img = res.data
                    setShopImages(shopImages.map(image => image.id === img_index
                            ? target
                            : image
                    ));
                    setShop(
                        { ...shop, shop_img: shopImages }
                    );
                }
            })
            .catch((err) => {
              console.error(err);
              alert("업로드에 실패하였습니다. 잠시 후 시도해주세요.");
            });
        } else {
          alert("파일형식이 올바르지 않습니다.")
        }
    };
    function imgUpload(e) {
        if (e.target.files[0] === undefined) {
            return;
        }
        const file = e.target.files[0];
        const menu_cd = modalMenu.menu_cd;
        if (fileType.indexOf(file.type) !== -1) {
          const params = new FormData();
          params.append('file', file);
          params.append('shop_cd', shop_cd);
          params.append('menu_cd', menu_cd);
          params.append('call', 'menu');
          axios
            .post(api.imgUpload, params)
            .then((res) => {
                if (res) {
                    setModalMenu(
                        { ...modalMenu, menu_img: res.data }
                    )
                }
            })
            .catch((err) => {
              console.error(err);
              alert("업로드에 실패하였습니다. 잠시 후 시도해주세요.");
            });
        } else {
          alert("파일형식이 올바르지 않습니다.")
        }
    };

    function saveShopInfo() {
        if (window.confirm("저장 후 되돌릴 수 없습니다. 변경된 내용을 저장하시겠습니까?")) {
            setLoading(true);
            const params = { 
            'shop': shop,
            'origin': shopOrigin
            };
            return new Promise(function(resolve, reject) {
            axios
                .post(api.saveShopInfo, params)
                .then(response => resolve(response.data))
                .catch(error => reject(error.response))
            })
            .then(res => {
            if (res) {
                alert('저장이 완료되었습니다.')
                setEditMode(false)
                setReload(reload + 1);
                setCategory('all');
            }
            setLoading(false);
            })
            .catch(err => {
            alert("현재 서버와의 연결이 원활하지 않습니다. 관리자에게 문의해주세요.");
            setLoading(false);
            })
        } else {
            return;
        }
    }

    function convertWeek(key) {
        const target = weeks.filter(day => day.key.match(key));
        const result = target[0].text;
        return result;
    }

    function modalOpen(targetId) {
        if (editMode) {
            if (targetId === 'new') {
                setCount(count + 1);
                setModalMenu({
                    menu_category: '',
                    menu_cd: 'new' + count,
                    menu_description: '',
                    menu_img: null,
                    menu_name: '',
                    menu_price: ''
                });
                setOpen(true);
            } else {
                const target = shop.menu_list.find(menu => menu.menu_cd === targetId);
                setModalMenu(target);
                setOpen(true);
            }
        } else {
            return;
        }
    }

    function rollBack() {
        if (window.confirm("수정된 내용이 초기화됩니다. 계속하시겠습니까?")) {
            const params = new FormData();
            params.append('shop_cd', shop_cd);
            axios
            .post(api.imgClear, params)
            .then((res) => {
                if (res) {
                    window.location.replace("/dashboard");
                }
            })
            .catch((err) => {
                console.error(err);
                alert("초기화에 실패하였습니다. 잠시 후 시도해주세요.");
            });
        } else {
            return;
        }
    }

    const getItemStyle = (isDragging, draggableStyle,img) => ({
        border: '1px solid rgb(200, 200, 200)',
        borderRadius:' 8px',
        padding: '8px',
        transition: 'background-color 0.2s ease',
        userSelect: 'none',
        margin: '4px',
        backgroundImage: 'url(' + img + ')',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '25%',
        height: '150px',
        pointerEvents: !editMode && 'none',
        ...draggableStyle,
      });
      
      const getListStyle = isDraggingOver => ({
        border: '1px solid rgb(0, 0, 0, 0.2)',
        borderRadius:' 8px',
        backgroundColor: isDraggingOver ? 'rgba(0, 0, 0, 0.15)' : 'rgba(0, 0, 0, 0.05)',
        padding: '8px',
        listStyle: 'none',
        display: 'flex',
        overflow: 'auto',
      });

    function shopInfoView() {
        return (
            <>
            {shop.length !== 0 && <>
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
                    <label>
                        매장주소 
                        <Popup size='tiny' position='right center' className='dashboard-info-popup' trigger={<Icon className='dashboard-info-icon' name='info circle'/>} header={'Tip'} content={'수정모드를 활성화 후,\n 빨간핀을 이동시켜 위치를 지정해주세요.'} inverted/>
                    </label>
                    {editMode ? <></>
                    :
                    <Header className='dashboard-shopinfo-text'>{shop.shop_location}</Header>
                    }
                    <MapContainer id='map' shop={shop} setShop={setShop} changeLocation={changeLocation} value={shop.shop_location} editMode={editMode} permission={permission}/>
                </Form.Field>
                <Form.Field className={editMode && 'dashboard-map-bottom'}>
                    <label>
                        매장 사진
                        <Popup size='tiny' position='right center' className='dashboard-info-popup' trigger={<Icon className='dashboard-info-icon' name='info circle'/>} header={'Tip'} content={'클릭시 사진변경,\n 이동시 순서가 변경됩니다.'} inverted/>
                    </label>
                    <DragDropContext onDragEnd={handleChange}>
                        <Droppable droppableId="shopImages" direction="horizontal">
                        {(provided, snapshot) => (
                        <ul ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)} {...provided.droppableProps}>
                            <input hidden type='file' ref={inputRef} accept=".png, .jpg, .jpeg" onChange={shopImgUpload}/>
                            {shopImages.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                    {(provided, snapshot) => (
                                        <li onClick={setImg} id={item.id} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={getItemStyle(snapshot.isDragging,provided.draggableProps.style,api.imgRender(item.img))}/>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </ul>
                        )}
                        </Droppable>
                    </DragDropContext>
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
                    <Form.Select className='dashboard-shopinfo-hours' label='휴무일' placeholder='휴무없음' value={shop.shop_holiday} options={weeks} onChange={changeHoliday}/>
                    </>
                    :
                    <Form.Field>
                        <label>매장 운영시간</label>
                        <Header className='dashboard-shopinfo-text'>{shop.shop_open} ~ {shop.shop_close}
                            <span className='detailpage-holiday'>({shop.shop_holiday === 'none' ? '휴무일 없음' : convertWeek(shop.shop_holiday) + ' 휴무'})</span>
                        </Header>
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
            </>}
            </>
        )
    }
    function staffInfoView() {
        return (
            <>
            {shop.length !== 0 && <>
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
                    <Input icon='search' className='dashboard-staff-search' placeholder='직원명으로 검색' value={searchValue} onChange={staffSearch}/>
                    <Table celled unstackable selectable className='dashboard-table'>
                        <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell className='dashboard-table-no'>No</Table.HeaderCell>
                            <Table.HeaderCell className='dashboard-table-name'>이름</Table.HeaderCell>
                            <Table.HeaderCell className='dashboard-table-career'>경력/직급</Table.HeaderCell>
                            <Table.HeaderCell className='dashboard-table-info' colSpan={editMode ? '2' : '1'}>직원소개</Table.HeaderCell>
                        </Table.Row>
                        </Table.Header>

                        <Table.Body>
                        {staffList.length !== 0 ?
                            staffList.map(staff => (
                                <Table.Row key={staff.user_cd}>
                                    <Table.Cell className='dashboard-table-no'>
                                        {staffList.indexOf(staff) + 1}
                                    </Table.Cell>
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
                                        {staff.user_cd !== userInfo.user_cd &&
                                            <Icon name='x' onClick={() => staffDelete(staff.user_cd)}/>
                                        }
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
            </>}
            </>
        )
    }
    function menuInfoView() {
        return (
            <>
            {shop.length !== 0 && <>
            <Form className='dashboard-viewer-inline'>
                <Form.Field>
                    <label>메뉴 리스트</label>
                    <Select className='dashboard-viewer-category' placeholder='전체선택' value={category} options={categoryList} onChange={selectCategory}/>
                    {editMode && 
                    <Button.Group basic>
                        <Button icon='add' onClick={() => modalOpen('new')}/>
                    </Button.Group>
                    }
                    {menuList.length === 0 ?
                    <p className='dashboard-viewer-empty'>찾으시는 메뉴가 없습니다</p>
                    :
                    <>
                    {menuList.map(menu => (
                    <Item.Group unstackable className='dashboard-viewer-menu' key={menu.menu_cd}>
                        <Item className='detailpage-service'>
                        <Label circular className='dashboard-menu-label' color='black'>
                            {menuList.indexOf(menu) + 1}
                        </Label>
                            <Item.Image className='detailpage-service-img' src={api.imgRender(menu.menu_img === null ? menuDefault : menu.menu_img)}/>
                            <Item.Content
                                header={menu.menu_name ? menu.menu_name : '메뉴명 미입력'}
                                meta={menu.menu_price ? comma(menu.menu_price) + '원' : '가격 미입력'}
                                description={menu.menu_description ? menu.menu_description : <span className='empty'>설명 미입력</span>}
                            />
                            {editMode && <Item className='dashboard-content-icon'><Icon name='edit' onClick={() => modalOpen(menu.menu_cd)}/></Item>}
                        </Item>
                    </Item.Group>
                    ))}
                    </>
                    }
                    <div className='dashboard-content-final-empty'> </div>
                </Form.Field>
            </Form>
            </>}
            {modalMenu &&
            <Modal closeIcon closeOnDimmerClick={false} onClose={() => setOpen(false)} open={open}>
                <Modal.Header><Icon name='angle right'/>메뉴작성/편집</Modal.Header>
                <Modal.Content image>
                    <input hidden type='file' ref={inputRef} accept=".png, .jpg, .jpeg" onChange={imgUpload}/>
                    <Image className='dashboard-modal-img' src={modalMenu.menu_img ? modalMenu.menu_img : sampleImg} onClick={setImg} wrapped/>
                    <Modal.Description className='dashboard-modal-body'>
                        <Form.Group>
                            <Select placeholder='카테고리 선택' className='dashboard-modal-category-select' defaultValue={modalMenu.menu_category ? modalMenu.menu_category : 'direct'} options={modalCategoryList} onChange={selectModalCategory}/>
                            <Input placeholder='카테고리 입력' className='dashboard-modal-category' value={modalMenu.menu_category ? modalMenu.menu_category : ''} onChange={changeMenuCategory}/>
                        </Form.Group>
                        <Form.Group>
                            <Input placeholder='메뉴 이름' className='dashboard-modal-name' value={modalMenu.menu_name ? modalMenu.menu_name : ''} onChange={changeMenuName}/>
                            <Input placeholder='메뉴 가격' className='dashboard-modal-price' value={modalMenu.menu_price ? modalMenu.menu_price : ''} onChange={changeMenuPrice}/>
                        </Form.Group>
                        <Form.Group>
                            <TextArea placeholder='메뉴 설명' className='dashboard-modal-description' value={modalMenu.menu_description ? modalMenu.menu_description : ''} onChange={changeMenuDescription}/>
                        </Form.Group>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={() => menuDelete(modalMenu.menu_cd)} color='red'>삭제</Button>
                    <Button onClick={() => menuEdit(modalMenu.menu_cd)} color='blue'>수정 / 등록</Button>
                </Modal.Actions>
            </Modal>
            }
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
        setSearchValue(e.target.value);
    }

    function comma(number) {
        let num = number + ""; 
        let point = num.length % 3 ;
        let len = num.length; 
       
        let result = num.substring(0, point); 
        while (point < len) { 
            if (result !== "") result += ","; 
            result += num.substring(point, point + 3); 
            point += 3; 
        } 
        return result;
    }

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

    function staffDelete(targetId) {
        if (window.confirm("해당 직원을 삭제하시겠습니까?")) {
            const target = shop.staff_list.find(staff => staff.user_cd === targetId);
            const index = shop.staff_list.indexOf(target);
            staffList.splice(index, 1);
            setStaffList(staffList);
            setShop(
                { ...shop, staff_list: staffList }
            );
        } else {
            return;
        }
    }

    function selectCategory (e, { value }) {
        if (value === 'all') {
            setMenuList(shop.menu_list);
        } else {
            const result = shop.menu_list.filter(menu => menu.menu_category === value);
            setMenuList(result);
        }
        setCategory(value)
    }

    function selectModalCategory (e, { value }) {
        if (value === 'direct') {
            setModalMenu(
                { ...modalMenu, menu_category: '' }
            )
        } else {
            setModalMenu(
                { ...modalMenu, menu_category: value }
            )
        }
    }

    function menuDelete(targetId) {
        if (window.confirm("해당 메뉴를 삭제하시겠습니까?")) {
            const target = shop.menu_list.find(menu => menu.menu_cd === targetId);
            if (target === undefined) {
                setOpen(false);
                return;
            } else {
                shop.menu_list.splice(shop.menu_list.indexOf(target), 1);
                setShop(
                    { ...shop, menu_list: shop.menu_list }
                );
                setMenuList(shop.menu_list);
                if (category !== 'all') {
                    menuList.splice(menuList.indexOf(target), 1);
                    setMenuList(menuList);
                }

                // 카테고리에 메뉴 없을시 리스트에서 삭제
                const filter = shop.menu_list.filter(menu => menu.menu_category === target.menu_category);
                if (filter.length === 0) {
                    const del1 = categoryList.find(category => category.value === target.menu_category);
                    categoryList.splice(categoryList.indexOf(del1), 1);
                    setCategoryList(categoryList);
                    const del2 = modalCategoryList.find(category => category.value === target.menu_category);
                    modalCategoryList.splice(modalCategoryList.indexOf(del2), 1);
                    setModalCategoryList(modalCategoryList);
                }
                setOpen(false)
            }
        } else {
            return;
        }
    }

    function menuEdit(targetId) {
        if (modalMenu.menu_category.length === 0 || modalMenu.menu_name.length === 0 || modalMenu.menu_price.length === 0) {
            return alert('입력되지 않은 항목이 존재합니다.');
        }
        if (shop.menu_categorys.indexOf(modalMenu.menu_category) === -1) {
            categoryList.push({ key: modalMenu.menu_category, value: modalMenu.menu_category, text: modalMenu.menu_category });
            modalCategoryList.push({ key: modalMenu.menu_category, value: modalMenu.menu_category, text: modalMenu.menu_category });
            shop.menu_categorys.push(modalMenu.menu_category);
            setCategoryList(categoryList);
            setModalCategoryList(modalCategoryList);
            setShop(
                { ...shop, menu_categorys: shop.menu_categorys }
            );
        }

        // 신규
        if (modalMenu.menu_cd.toString().indexOf('new') !== -1) {
            const target = shop.menu_list.find(menu => menu.menu_cd === targetId);
            // 신규 등록
            if (target === undefined) {
                if (category === modalMenu.menu_category) {
                    menuList.push({
                        menu_category: modalMenu.menu_category,
                        menu_cd: modalMenu.menu_cd,
                        menu_description: modalMenu.menu_description ? modalMenu.menu_description : '',
                        menu_img: modalMenu.menu_img ? modalMenu.menu_img : menuDefault,
                        menu_name: modalMenu.menu_name,
                        menu_price: modalMenu.menu_price
                    });
                }
                setMenuList(menuList);
                shop.menu_list.push({
                    menu_category: modalMenu.menu_category,
                    menu_cd: modalMenu.menu_cd,
                    menu_description: modalMenu.menu_description ? modalMenu.menu_description : '',
                    menu_img: modalMenu.menu_img ? modalMenu.menu_img : menuDefault,
                    menu_name: modalMenu.menu_name,
                    menu_price: modalMenu.menu_price
                });
                setShop(
                    { ...shop, menu_list: shop.menu_list }
                );
            // 신규 수정
            } else {
                setMenuList(
                    menuList.map(
                        menu => menu.menu_cd === modalMenu.menu_cd
                        ? modalMenu
                        : menu
                    )
                );
                setShop(
                    { ...shop, menu_list: shop.menu_list.map(
                        menu => menu.menu_cd === modalMenu.menu_cd
                        ? modalMenu
                        : menu
                    )}
                );
            }
            setOpen(false);
            
        // 기존 수정
        } else {
            const res = menuList.map(
                menu => menu.menu_cd === modalMenu.menu_cd
                ? modalMenu
                : menu
            )
            setMenuList(res);
            if (category !== 'all') {
                const result = res.filter(menu => menu.menu_category === category);
                setMenuList(result);
            }
            setShop(
                { ...shop, menu_list: shop.menu_list.map(
                    menu => menu.menu_cd === modalMenu.menu_cd
                    ? modalMenu
                    : menu
                )}
            );
            setOpen(false);
        }
    }

    return(
    <>
    <div className="dashboard-main">
        <Menu className='dashboard-menu' vertical>
            {menuVisible ?
                <>
                <Menu.Header className='dashboard-menu-fold' onClick={() => {setMenuVisible(false)}}>
                    <Icon name='angle double up'/>
                </Menu.Header>
                <Menu.Header><Icon name='hdd'/> 매장관리</Menu.Header>
                <Menu.Menu>
                    <Menu.Item name='shopInfo' active={activeItem === 'shopInfo'} onClick={handleItemClick}>
                        ・ 매장정보
                    </Menu.Item>
                    <Menu.Item name='staffInfo' active={activeItem === 'staffInfo'} onClick={handleItemClick}>
                        ・ 직원정보
                    </Menu.Item>
                    <Menu.Item name='menuInfo' active={activeItem === 'menuInfo'} onClick={handleItemClick}>
                        ・ 메뉴정보
                    </Menu.Item>
                    <Dropdown className='dashboard-menu-dropdown' item text='・ 수정 / 저장' onClick={mobileCheck}>
                        <Dropdown.Menu>
                            <Dropdown.Item icon={editMode ? 'check' : 'edit'} text={editMode ? '임시저장' : '수정모드 활성화'} onClick={() => setEditMode(!editMode)}/>
                            <Dropdown.Item icon='save' text='저장'  onClick={saveShopInfo}/>
                            <Dropdown.Item icon='redo' text='수정값 초기화' onClick={rollBack}/>
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Menu>
                <Menu.Header><Icon name='calendar check'/> 예약</Menu.Header>
                <Menu.Menu>
                    <Menu.Item name='bookingInfo' active={activeItem === 'bookingInfo'} onClick={handleItemClick}>
                        ・ 예약정보
                    </Menu.Item>
                    <Menu.Item name='bookingData' active={activeItem === 'bookingData'} onClick={handleItemClick}>
                        ・ 예약통계
                    </Menu.Item>
                </Menu.Menu>
                <Menu.Header><Icon name='gift'/> 이벤트</Menu.Header>
                <Menu.Menu>
                    <Menu.Item name='eventInfo' active={activeItem === 'eventInfo'} onClick={handleItemClick}>
                        ・ 이벤트관리
                    </Menu.Item>
                    <Menu.Item name='couponInfo' active={activeItem === 'couponInfo'} onClick={handleItemClick}>
                        ・ 쿠폰관리
                    </Menu.Item>
                </Menu.Menu>
                <Menu.Header><Icon name='question circle outline'/> 기타</Menu.Header>
                <Menu.Menu>
                    <Menu.Item name='contract' active={activeItem === 'contract'} onClick={handleItemClick}>
                        ・ 계약정보
                    </Menu.Item>
                    <Menu.Item name='system' active={activeItem === 'system'} onClick={handleItemClick}>
                        ・ 시스템문의
                    </Menu.Item>
                    <Menu.Item name='help' active={activeItem === 'help'} onClick={handleItemClick}>
                        ・ 도움말
                    </Menu.Item>
                </Menu.Menu>
                <Menu.Menu>
                    <Menu.Item></Menu.Item>
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
            {loading ? <Loading/>
            :
            <>
            {activeItem === 'shopInfo' && shopInfoView()}
            {activeItem === 'staffInfo' && staffInfoView()}
            {activeItem === 'menuInfo' && menuInfoView()}

            {activeItem === 'bookingInfo' && <BookingInfo/>}
            {activeItem === 'bookingData' && <BookingData/>}

            {activeItem === 'eventInfo' && sampleView()}
            {activeItem === 'couponInfo' && sampleView()}

            {activeItem === 'contract' && sampleView()}
            {activeItem === 'system' && sampleView()}
            {activeItem === 'help' && sampleView()}
            </>
            }
        </Segment>
    </div>
    </>
    )
  };