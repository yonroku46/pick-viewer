import { useEffect, useState, useRef } from 'react';
import { Label, Modal, Image, Menu, Icon, Dropdown, Form, Segment, Input, TextArea,  Button, Table, List, Item, Dimmer, Loader, Select, Pagination } from 'semantic-ui-react'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import * as api from '../../rest/api'
import MapContainer from "../public/MapContainer";
import BookingInfo from "./DashboardBookingInfo";
import BookingData from "./DashboardBookingData";
import moment from 'moment';
import axios from 'axios';

export default function DashboardPage(props) {
    const isAuthorized = sessionStorage.getItem('isAuthorized');
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    const role = userInfo ? userInfo.role : null;
    if (isAuthorized === null) {
        props.history.goBack(1);
    }

    const [reload, setReload] = useState(0);
    const [imgChange, setImgChange] = useState(0);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [activePage, setActivePage] = useState(1);

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
    const shopCd = userInfo ? userInfo.employment : null;
    
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
    function handlePaginationChange (e, { activePage }) {
        setActivePage(activePage);
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
    const startHour = 0;
    const endHour = 24;

    for (let i = 0; i < startHour; i++) {
        hours.shift();
    }
    for (let i = 0; i <  23 - endHour; i++) {
        hours.pop();
    }

    function copy(text) {
        if (!navigator.clipboard) {
            return alert("해당 브라우저에서 클립보드를 지원하지 않습니다.\n아래 코드를 캡쳐 후 사용 바랍니다.\n[ " + text + " ]");
        }
        navigator.clipboard.writeText(text);
        alert("매장코드가 복사되었습니다.\n[ " + text + " ]");
    }

    function mobileCheck() {
        if (window.innerWidth < 767) {
            alert("원활한 사용을 위해, 정보수정은 PC 또는 태블릿을 이용 바랍니다.");
        }
    }

    useEffect(() => {
        if (role !== 3) {
            alert("잘못된 접근입니다.")
            props.history.goBack(1);
        }
        setLoading(true);
        return new Promise(function(resolve, reject) {
          axios
            .get(api.dashboardInfo, {
                params: {
                  'shopCd': shopCd,
                  'role': role
                }
            })
            .then(response => resolve(response.data))
            .catch(error => reject(error.response))
        })
        .then(res => {
          if (res.success) {
            setShop(res.data);
            setStaffList(res.data.staffList);
            makeMenuList(res.data.menuList)
            makeCategoryList(res.data.menuCategories);
            makeShopInfo(res.data);
            getRequestList(shopCd);
          }
        })
        .catch(err => {
          alert("현재 서버와의 연결이 원활하지 않습니다. 관리자에게 문의해주세요.");
          setLoading(false);
        })
      }, [reload])

    function makeMenuList(menuList) {
        menuList.forEach(menu => menu.newFlag = false)
        setMenuList(menuList);
    }
    
    function makeCategoryList(menuCategories) {
        const result = [];
        const modalResult = [];
        result.push({ key: 'all', value: 'all', text: '전체선택' });
        modalResult.push({ key: 'direct', value: 'direct', text: '직접입력' });
        menuCategories.map(category => {
            result.push({ key: category, value: category, text: category });
            modalResult.push({ key: category, value: category, text: category });
        });
        setCategoryList(result);
        setModalCategoryList(modalResult);
    }
    
    function makeShopInfo(data) {
        const imgList = data.shopImg.split(',');
        const result = [];
        const originResult = [];
        for (let index = 0; index < 4; index++) {
            result.push({ id: (index + 1).toString(), imgPath: imgList[index] ? imgList[index] : shopDefault });
            originResult.push({ id: (index + 1).toString(), imgPath: imgList[index] ? imgList[index] : shopDefault });
        }
        setShop(
            { ...JSON.parse(JSON.stringify(data)), shopImg: result }
        );
        if (imgChange == 0 && shopOrigin.shopImg == undefined) {
            setShopOrigin(
                { ...JSON.parse(JSON.stringify(data)), shopImg: originResult }
            );
        }
        setShopImages(result);
    }
    
    function getRequestList(shopCd) {
        return new Promise(function(resolve, reject) {
          axios
            .get(api.shopRequestList, {
              params: {
                'shopCd': shopCd,
                'role': role
              }
            })
            .then(response => resolve(response.data))
            .catch(error => reject(error.response))
        })
        .then(data => {
          if (data.success) {
            setRequestList(data.dataList);
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
            shopImg.push(item.imgPath)
        });
        setShop(
            { ...shop, shopImg: items }
        );
        setShopImages(items);
    };

    function changeLocation(e) {
        setShop(
            { ...shop, shopLocation: e.target.value }
        );
    }
    function changeTel(e, { tabIndex }) {
        const shopTel = shop.shopTel.split('-');
        shopTel[tabIndex] = e.target.value.replace(/[^0-9]/g, '');
        setShop(
            { ...shop, shopTel: shopTel[0] + '-' + shopTel[1] + '-' + shopTel[2] }
        );
    }
    function changeOpen(e, { value }) {
        setShop(
            { ...shop, shopOpen: value }
        );
    }
    function changeClose(e, { value }) {
        setShop(
            { ...shop, shopClose: value }
        );
    }
    function changeHoliday(e, { value }) {
        setShop(
            { ...shop, shopHoliday: value }
        );
    }
    function changeShopInfo(e) {
        setShop(
            { ...shop, shopInfo: e.target.value }
        );
    }
    function changeCareer(e, { tabIndex }) {
        setStaffList(
            staffList.map(
                staff => staff.userCd === tabIndex
                ? { ...staff, career: e.target.value }
                : staff
            )
        );
        setShop(
            { ...shop, staffList: shop.staffList.map(
                staff => staff.userCd === tabIndex
                ? { ...staff, career: e.target.value }
                : staff
            )}
        );
    }
    function changeInfo(e, { tabIndex }) {
        setStaffList(
            staffList.map(
                staff => staff.userCd === tabIndex
                ? { ...staff, info: e.target.value }
                : staff
            )
        );
        setShop(
            { ...shop, staffList: shop.staffList.map(
                staff => staff.userCd === tabIndex
                ? { ...staff, info: e.target.value }
                : staff
            )}
        );
    }
    function changeMenuCategory(e) {
        setModalMenu(
            { ...modalMenu, menuCategory: e.target.value.replace(/[\\\=]/gi, '') }
        );
    }
    function changeMenuName(e) {
        setModalMenu(
            { ...modalMenu, menuName: e.target.value.replace(/[\\\=]/gi, '') }
        );
    }
    function changeMenuPrice(e) {
        setModalMenu(
            { ...modalMenu, menuPrice: e.target.value.replace(/[^0-9]/g, '') }
        );
    }
    function changeMenuDescription(e) {
        setModalMenu(
            { ...modalMenu, menuDescription: e.target.value.replace(/[\\\=]/gi, '') }
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
          params.append('shopCd', shopCd);
          params.append('img_index', img_index);
          params.append('call', 'shop');
          axios
            .post(api.imgUpload, params)
            .then((res) => {
                const data = res.data.data;
                if (data.result) {
                    const target = shopImages.find(image => image.id === img_index)
                    target.imgPath = data.imgPath
                    setShopImages(shopImages.map(image => image.id === img_index
                            ? target
                            : image
                    ));
                    setShop(
                        { ...shop, shopImg: shopImages }
                    );
                    setImgChange(imgChange + 1);
                    // 같은파일 업로드 회피용
                    e.target.value = '';
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
        const menuCd = modalMenu.menuCd;
        if (fileType.indexOf(file.type) !== -1) {
          const params = new FormData();
          params.append('file', file);
          params.append('shopCd', shopCd);
          params.append('menuCd', menuCd);
          params.append('call', 'menu');
          axios
            .post(api.imgUpload, params)
            .then((res) => {
                const data = res.data.data;
                if (data.result) {
                    setModalMenu(
                        { ...modalMenu, menuImg: data.imgPath }
                    )
                    e.target.value = '';
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
                'shopOrigin': shopOrigin
            };
            return new Promise(function(resolve, reject) {
            axios
                .post(api.dashboardSave, params)
                .then(response => resolve(response.data))
                .catch(error => reject(error.response))
            })
            .then(res => {
                const result = res.data.result;
                if (result) {
                    alert('저장이 완료되었습니다.')
                    setEditMode(false)
                    setReload(reload + 1);
                    setCategory('all');
                } else {
                    alert('저장에 실패하였습니다. 잠시 후 시도해주세요.')
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

    function getPrivateCode(key) {
        let result = moment().format('YYMMDD');
        result = result + key.toString();
        return parseInt(result);
    }

    function modalOpen(targetId) {
        if (editMode) {
            if (targetId === 'new') {
                setCount(count + 1);
                setModalMenu({
                    menuCategory: '',
                    menuCd: getPrivateCode(count),
                    menuDescription: '',
                    menuImg: null,
                    menuName: '',
                    menuPrice: '',
                    newFlag: true
                });
                setOpen(true);
            } else {
                const target = shop.menuList.find(menu => menu.menuCd === targetId);
                setModalMenu(target);
                setOpen(true);
            }
        } else {
            return;
        }
    }

    function rollBack() {
        if (window.confirm("수정된 내용이 초기화됩니다. 계속하시겠습니까?")) {
            const params = { 
                'shopCd': shopCd,
                'role': role
            };
            axios
            .post(api.tmpClear, params)
            .then((res) => {
                const data = res.data.data;
                if (data.result) {
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

    const getItemStyle = (isDragging, draggableStyle, img) => ({
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
                    <Menu floated='right' onClick={() => copy(shop.shopSerial)}>
                        <Menu.Item as='a' icon>
                            <Icon name='qrcode'/>
                        </Menu.Item>
                    </Menu>
                    <label><Icon name='angle right'/>매장명</label>
                    <p className='dashboard-shopinfo-text'>{shop.shopName}</p>
                </Form.Field>
                <Form.Field>
                    <label><Icon name='angle right'/>매장주소</label>
                    {editMode ? <></>
                    :
                    <p className='dashboard-shopinfo-text'>{shop.shopLocation}</p>
                    }
                    <MapContainer id='map' shop={shop} setShop={setShop} changeLocation={changeLocation} value={shop.shopLocation} editMode={editMode} role={role}/>
                </Form.Field>
                <Form.Field className={editMode && 'dashboard-map-bottom'}>
                    <label><Icon name='angle right'/>매장 사진</label>
                    <DragDropContext onDragEnd={handleChange}>
                        <Droppable droppableId="shopImages" direction="horizontal">
                        {(provided, snapshot) => (
                        <ul ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)} {...provided.droppableProps}>
                            <input hidden type='file' ref={inputRef} accept=".png, .jpg, .jpeg" onChange={shopImgUpload}/>
                            {shopImages.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                    {(provided, snapshot) => (
                                        <li onClick={setImg} id={item.id} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={getItemStyle(snapshot.isDragging,provided.draggableProps.style,api.imgRender(item.imgPath))}/>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </ul>
                        )}
                        </Droppable>
                    </DragDropContext>
                </Form.Field>
                <Form.Group>
                    <Form.Field>
                        <label><Icon name='angle right'/>매장 전화번호</label>
                        {editMode ? 
                        <>
                        <Input className='dashboard-shopinfo-tel' placeholder='000' value={shop.shopTel.split('-')[0]} tabIndex='0' onChange={changeTel}/>
                        <Input className='dashboard-shopinfo-tel' placeholder='000' value={shop.shopTel.split('-')[1]} tabIndex='1' onChange={changeTel}/>
                        <Input className='dashboard-shopinfo-tel' placeholder='0000' value={shop.shopTel.split('-')[2]} tabIndex='2' onChange={changeTel}/>
                        </>
                        :
                        <p className='dashboard-shopinfo-text'>{shop.shopTel.length === 2 ? <span className='empty'>전화번호 미입력</span> : shop.shopTel}</p>
                        }
                    </Form.Field>
                </Form.Group>
                <Form.Group>
                    {editMode ? 
                    <>
                    <Form.Field className='form-interval'>
                        <label><Icon name='angle right'/>오픈시간</label>
                        <Select className='dashboard-shopinfo-hours' placeholder='09:00' value={shop.shopOpen} options={hours} onChange={changeOpen}/>
                    </Form.Field>
                    <Form.Field className='form-interval'>
                        <label><Icon name='angle right'/>마감시간</label>
                        <Select className='dashboard-shopinfo-hours' placeholder='18:00' value={shop.shopClose} options={hours} onChange={changeClose}/>
                    </Form.Field>
                    <Form.Field className='form-interval'>
                        <label><Icon name='angle right'/>휴무일</label>
                        <Select className='dashboard-shopinfo-hours' placeholder='휴무없음' value={shop.shopHoliday} options={weeks} onChange={changeHoliday}/>
                    </Form.Field>
                    </>
                    :
                    <Form.Field className='form-interval'>
                        <label><Icon name='angle right'/>매장 운영시간</label>
                        <p className='dashboard-shopinfo-text'>{shop.shopOpen} ~ {shop.shopClose}
                            <span className='detailpage-holiday'>({shop.shopHoliday === 'none' ? '휴무일 없음' : convertWeek(shop.shopHoliday) + ' 휴무'})</span>
                        </p>
                    </Form.Field>
                    }
                </Form.Group>
                {editMode ? 
                <Form.Field className='form-interval'>
                    <label><Icon name='angle right'/>매장 소개</label>
                    <TextArea placeholder='매장 소개를 입력해보세요. (최대 100자)' value={shop.shopInfo} onChange={changeShopInfo}/>
                </Form.Field>
                :
                <Form.Field className='form-interval'>
                    <label><Icon name='angle right'/>매장 소개</label>
                    <p className='dashboard-shopinfo-text'>{shop.shopInfo}</p>
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
                    <label><Icon name='angle right'/>총 직원수</label>
                    <p className='dashboard-shopinfo-text'>{shop.staffList.length + '명'}</p>
                </Form.Field>
                <Form.Field>
                    <label><Icon name='angle right'/>직원 신쳥현황</label>
                    {requestList.length !== 0 ?
                    <List selection verticalAlign='middle'>
                        {requestList.map(request => (
                            <List.Item className='dashboard-viewer-userinfo'>
                                <Image className="user-icon" src={api.imgRender(request.userImg === null ? userimgDefault : request.userImg)}/>
                                <List.Content>
                                    <List.Header>
                                        {request.userName}
                                        <span className='dashboard-viewer-email'>{request.userEmail}</span>
                                    </List.Header>
                                </List.Content>
                                <List.Content floated='right'>
                                    <Button inverted color='red' onClick={() => requestConfirm(2, request.requestCd)}>거절</Button>
                                    <Button inverted color='green' onClick={() => requestConfirm(1, request.requestCd)}>승인</Button>
                                </List.Content>
                            </List.Item>
                        ))}
                    </List>
                    : 
                    <p className='dashboard-shopinfo-text'>
                        현재 없음
                    </p>
                    }
                </Form.Field>
                <Form.Field>
                    <label><Icon name='angle right'/>직원 리스트</label>
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
                                <Table.Row key={staff.userCd}>
                                    <Table.Cell className='dashboard-table-no'>
                                        {staffList.indexOf(staff) + 1}
                                    </Table.Cell>
                                    <Table.Cell className='dashboard-table-name'>
                                        {staff.userName}
                                    </Table.Cell>
                                    <Table.Cell className={editMode ? 'dashboard-table-career edit-input' : 'dashboard-table-career'}>
                                        {editMode ? 
                                        <Input placeholder={staff.career} value={staff.career} tabIndex={staff.userCd} onChange={changeCareer}/>
                                        :
                                        staff.career ? staff.career : <span className='empty'>미입력</span>
                                        }
                                    </Table.Cell>
                                    <Table.Cell className={editMode ? 'dashboard-table-info edit-input' : 'dashboard-table-info'}>
                                        {editMode ? 
                                        <Input placeholder={staff.info} value={staff.info} tabIndex={staff.userCd} onChange={changeInfo}/>
                                        :
                                        staff.info ? staff.info : <span className='empty'>미입력</span>
                                        }
                                    </Table.Cell>
                                    {editMode &&
                                    <Table.Cell className='dashboard-table-delete'>
                                        {staff.userCd !== userInfo.userCd &&
                                            <Icon name='x' onClick={() => staffDelete(staff.userCd)}/>
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
                    <div className='dashboard-pagination'>
                        <Pagination pointing secondary
                            defaultActivePage={1}
                            firstItem={null}
                            lastItem={null}
                            onPageChange={handlePaginationChange}
                            totalPages={3}
                        />
                    </div>
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
                    <label><Icon name='angle right'/>메뉴 리스트</label>
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
                    <Item.Group unstackable className='dashboard-viewer-menu' key={menu.menuCd}>
                        <Item className='detailpage-service'>
                        <Label className='dashboard-menu-label'>
                            {menuList.indexOf(menu) + 1}
                        </Label>
                            <Item.Image className='dashboard-viewer-menu-img' src={api.imgRender(menu.menuImg === null ? menuDefault : menu.menuImg)}/>
                            <Item.Content
                                header={menu.menuName ? menu.menuName : '메뉴명 미입력'}
                                meta={menu.menuPrice ? comma(menu.menuPrice) + '원' : '가격 미입력'}
                                description={menu.menuDescription ? menu.menuDescription : <span className='empty'>설명 미입력</span>}
                            />
                            {editMode && <Item className='dashboard-content-icon'><Icon name='edit' onClick={() => modalOpen(menu.menuCd)}/></Item>}
                        </Item>
                    </Item.Group>
                    ))}
                    </>
                    }
                    <div className='dashboard-pagination'>
                        <Pagination pointing secondary
                            defaultActivePage={1}
                            firstItem={null}
                            lastItem={null}
                            onPageChange={handlePaginationChange}
                            totalPages={3}
                        />
                    </div>
                    <div className='dashboard-content-final-empty'> </div>
                </Form.Field>
            </Form>
            </>}
            {modalMenu &&
            <Modal closeIcon closeOnDimmerClick={false} onClose={() => setOpen(false)} open={open}>
                <Modal.Header><Icon name='angle right'/>메뉴작성/편집</Modal.Header>
                <Modal.Content image>
                    <input hidden type='file' ref={inputRef} accept=".png, .jpg, .jpeg" onChange={imgUpload}/>
                    <Image className='dashboard-modal-img' src={modalMenu.menuImg ? modalMenu.menuImg : sampleImg} onClick={setImg} wrapped/>
                    <Modal.Description className='dashboard-modal-body'>
                        <Form.Group>
                            <Select placeholder='카테고리 선택' className='dashboard-modal-category-select' defaultValue={modalMenu.menuCategory ? modalMenu.menuCategory : 'direct'} options={modalCategoryList} onChange={selectModalCategory}/>
                            <Input placeholder='카테고리 입력' className='dashboard-modal-category' value={modalMenu.menuCategory ? modalMenu.menuCategory : ''} onChange={changeMenuCategory}/>
                        </Form.Group>
                        <Form.Group>
                            <Input placeholder='메뉴 이름' className='dashboard-modal-name' value={modalMenu.menuName ? modalMenu.menuName : ''} onChange={changeMenuName}/>
                            <Input placeholder='메뉴 가격' className='dashboard-modal-price' value={modalMenu.menuPrice ? modalMenu.menuPrice : ''} onChange={changeMenuPrice}/>
                        </Form.Group>
                        <Form.Group>
                            <TextArea placeholder='메뉴 설명' className='dashboard-modal-description' value={modalMenu.menuDescription ? modalMenu.menuDescription : ''} onChange={changeMenuDescription}/>
                        </Form.Group>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={() => menuDelete(modalMenu.menuCd)} color='red'>삭제</Button>
                    <Button onClick={() => menuEdit(modalMenu.menuCd)} color='blue'>수정 / 등록</Button>
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
              <Loader size='large'></Loader>
            </Dimmer>
          )
    }

    function staffSearch(e) {
        const result = shop.staffList.filter(staff => staff.userName.match(e.target.value));
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

    function requestConfirm(requestStat, targetId) {
        const target = requestList.find(request => request.requestCd === targetId);
        const params = { 
            'shopCd': shopCd,
            'userCd': target.userCd,
            'requestCd': target.requestCd,
            'requestStat': requestStat
        };
        return new Promise(function(resolve, reject) {
        axios
            .post(api.requestConfirm, params)
            .then(response => resolve(response.data))
            .catch(error => reject(error.response))
        })
        .then(data => {
            if (data.success) {
                alert("처리가 완료되었습니다.");
                setReload(reload + 1);
            } else {
                alert("처리가 실패하였습니다. 잠시 후 다시 시도해주세요.");
            }
        })
        .catch(err => {
            alert("현재 서버와의 연결이 원활하지 않습니다. 관리자에게 문의해주세요.");
        })
    }

    function staffDelete(targetId) {
        if (window.confirm("해당 직원을 삭제하시겠습니까?")) {
            const target = shop.staffList.find(staff => staff.userCd === targetId);
            const index = shop.staffList.indexOf(target);
            staffList.splice(index, 1);
            setStaffList(staffList);
            setShop(
                { ...shop, staffList: staffList }
            );
        } else {
            return;
        }
    }

    function selectCategory (e, { value }) {
        if (value === 'all') {
            setMenuList(shop.menuList);
        } else {
            const result = shop.menuList.filter(menu => menu.menuCategory === value);
            setMenuList(result);
        }
        setCategory(value)
    }

    function selectModalCategory (e, { value }) {
        if (value === 'direct') {
            setModalMenu(
                { ...modalMenu, menuCategory: '' }
            )
        } else {
            setModalMenu(
                { ...modalMenu, menuCategory: value }
            )
        }
    }

    function menuDelete(targetId) {
        if (window.confirm("해당 메뉴를 삭제하시겠습니까?")) {
            const target = shop.menuList.find(menu => menu.menuCd === targetId);
            if (target === undefined) {
                setOpen(false);
                return;
            } else {
                shop.menuList.splice(shop.menuList.indexOf(target), 1);
                setShop(
                    { ...shop, menuList: shop.menuList }
                );
                setMenuList(shop.menuList);
                if (category !== 'all') {
                    menuList.splice(menuList.indexOf(target), 1);
                    setMenuList(menuList);
                }

                // 카테고리에 메뉴 없을시 리스트에서 삭제
                const filter = shop.menuList.filter(menu => menu.menuCategory === target.menuCategory);
                if (filter.length === 0) {
                    const del1 = categoryList.find(category => category.value === target.menuCategory);
                    categoryList.splice(categoryList.indexOf(del1), 1);
                    setCategoryList(categoryList);
                    const del2 = modalCategoryList.find(category => category.value === target.menuCategory);
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
        if (modalMenu.menuCategory.length === 0 || modalMenu.menuName.length === 0 || modalMenu.menuPrice.length === 0) {
            return alert('입력되지 않은 항목이 존재합니다.');
        }
        if (shop.menuCategories.indexOf(modalMenu.menuCategory) === -1) {
            categoryList.push({ key: modalMenu.menuCategory, value: modalMenu.menuCategory, text: modalMenu.menuCategory });
            modalCategoryList.push({ key: modalMenu.menuCategory, value: modalMenu.menuCategory, text: modalMenu.menuCategory });
            shop.menuCategories.push(modalMenu.menuCategory);
            setCategoryList(categoryList);
            setModalCategoryList(modalCategoryList);
            setShop(
                { ...shop, menuCategories: shop.menuCategories }
            );
        }

        // 신규
        if (modalMenu.newFlag) {
            const target = shop.menuList.find(menu => menu.menuCd === targetId);
            // 신규 등록
            if (target === undefined) {
                if (category === modalMenu.menuCategory) {
                    menuList.push({
                        menuCategory: modalMenu.menuCategory,
                        menuCd: modalMenu.menuCd,
                        menuDescription: modalMenu.menuDescription ? modalMenu.menuDescription : '',
                        menuImg: modalMenu.menuImg ? modalMenu.menuImg : menuDefault,
                        menuName: modalMenu.menuName,
                        menuPrice: modalMenu.menuPrice,
                        newFlag: modalMenu.newFlag
                    });
                }
                setMenuList(menuList);
                shop.menuList.push({
                    menuCategory: modalMenu.menuCategory,
                    menuCd: modalMenu.menuCd,
                    menuDescription: modalMenu.menuDescription ? modalMenu.menuDescription : '',
                    menuImg: modalMenu.menuImg ? modalMenu.menuImg : menuDefault,
                    menuName: modalMenu.menuName,
                    menuPrice: modalMenu.menuPrice,
                    newFlag: modalMenu.newFlag
                });
                setShop(
                    { ...shop, menuList: shop.menuList }
                );
            // 신규 수정
            } else {
                setMenuList(
                    menuList.map(
                        menu => menu.menuCd === modalMenu.menuCd
                        ? modalMenu
                        : menu
                    )
                );
                setShop(
                    { ...shop, menuList: shop.menuList.map(
                        menu => menu.menuCd === modalMenu.menuCd
                        ? modalMenu
                        : menu
                    )}
                );
            }
            setOpen(false);
            
        // 기존 수정
        } else {
            const res = menuList.map(
                menu => menu.menuCd === modalMenu.menuCd
                ? modalMenu
                : menu
            )
            setMenuList(res);
            if (category !== 'all') {
                const result = res.filter(menu => menu.menuCategory === category);
                setMenuList(result);
            }
            setShop(
                { ...shop, menuList: shop.menuList.map(
                    menu => menu.menuCd === modalMenu.menuCd
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
        <Menu className={menuVisible ? 'dashboard-menu' : 'dashboard-menu non-visible'}vertical>
            {menuVisible ?
                <>
                <Menu.Header className={window.innerWidth < 767 ? 'dashboard-menu-fold' : 'dashboard-menu-fold dashboard-pc'} onClick={() => {setMenuVisible(false)}}>
                    <Icon name={window.innerWidth < 767 ? 'angle double up' : 'angle double left'}/>
                </Menu.Header>
                <Menu.Header><Icon name='hdd'/> 매장관리</Menu.Header>
                <Menu.Menu>
                    <Menu.Item name='shopInfo' active={activeItem === 'shopInfo'} onClick={handleItemClick}>
                        매장정보
                    </Menu.Item>
                    <Menu.Item name='staffInfo' active={activeItem === 'staffInfo'} onClick={handleItemClick}>
                        직원정보
                    </Menu.Item>
                    <Menu.Item name='menuInfo' active={activeItem === 'menuInfo'} onClick={handleItemClick}>
                        메뉴정보
                    </Menu.Item>
                    <Dropdown className='dashboard-menu-dropdown' icon={editMode ? 'toggle on' : 'toggle off'} item text='수정 / 저장' onClick={mobileCheck}>
                        <Dropdown.Menu>
                            <Dropdown.Item icon={editMode ? 'check' : 'edit'} text={editMode ? '임시저장' : '수정모드 활성화'} onClick={() => setEditMode(!editMode)}/>
                            <Dropdown.Item icon='save' text='저장'  onClick={saveShopInfo}/>
                            <Dropdown.Item icon='redo' text='수정값 초기화' onClick={rollBack}/>
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Menu>
                <Menu.Header className='header-title'><Icon name='calendar check'/> 예약</Menu.Header>
                <Menu.Menu>
                    <Menu.Item name='bookingInfo' active={activeItem === 'bookingInfo'} onClick={handleItemClick}>
                        예약정보
                    </Menu.Item>
                    <Menu.Item name='bookingData' active={activeItem === 'bookingData'} onClick={handleItemClick}>
                        예약통계
                    </Menu.Item>
                </Menu.Menu>
                <Menu.Header className='header-title'><Icon name='gift'/> 이벤트</Menu.Header>
                <Menu.Menu>
                    <Menu.Item name='eventInfo' active={activeItem === 'eventInfo'} onClick={handleItemClick}>
                        이벤트관리
                    </Menu.Item>
                    <Menu.Item name='couponInfo' active={activeItem === 'couponInfo'} onClick={handleItemClick}>
                        쿠폰관리
                    </Menu.Item>
                </Menu.Menu>
                <Menu.Header className='header-title'><Icon name='question circle outline'/> 기타</Menu.Header>
                <Menu.Menu>
                    <Menu.Item name='contract' active={activeItem === 'contract'} onClick={handleItemClick}>
                        계약정보
                    </Menu.Item>
                    <Menu.Item name='system' active={activeItem === 'system'} onClick={handleItemClick}>
                        시스템문의
                    </Menu.Item>
                    <Menu.Item name='help' active={activeItem === 'help'} onClick={handleItemClick}>
                        도움말
                    </Menu.Item>
                </Menu.Menu>
                <Menu.Menu>
                    <Menu.Item></Menu.Item>
                </Menu.Menu>
                </>
                :
                <Menu.Header className={window.innerWidth < 767 ? 'dashboard-menu-fold' : menuVisible ? 'dashboard-menu-fold dashboard-pc' : 'dashboard-menu-fold dashboard-pc non-visible'}  onClick={() => {setMenuVisible(true)}}>
                    <Icon name={window.innerWidth < 767 ? 'angle double down' : 'angle double right'}/>
                </Menu.Header>
            }
        </Menu>
        <Segment className='dashboard-viewer'>
            {loading ? <Loading/>
            :
            <>
            {activeItem === 'shopInfo' && shopInfoView()}
            {activeItem === 'staffInfo' && staffInfoView()}
            {activeItem === 'menuInfo' && menuInfoView()}

            {activeItem === 'bookingInfo' && <BookingInfo shop={shop}/>}
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