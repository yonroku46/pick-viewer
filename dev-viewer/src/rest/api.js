export function imgRender(img) {
    // const render = process.env.PUBLIC_URL + img;
    const PUBLIC_URL = 'http://' + window.location.host + '/';
    const render = PUBLIC_URL + img;
    return render;
}

// Public
export const check = "/api/check/";
export const imgUpload = "/api/imgUpload";
export const myFavorites = "/api/myFavorites";
export const login = "/api/login";
export const logout = "/api/logout";
export const bookingCheck = "/api/bookingCheck";

// HomePage
export const eventShopList = "/api/shop/list/event";
export const nearShopList = "/api/shop/list/near";

// SignupPage
export const mailService = "/api/mailService";
export const certification = "/api/certification";
export const signup = "/api/signup";

// HelpPage
export const mailCheck = "/api/mailCheck";
export const resetPwd = "/api/resetPwd";

// BookingPage
export const favorite = "/api/shop/favorite";
export const shopList = "/api/shop/list";
export const shopInfo = "/api/shop/info";
export const booking = "/api/shop/booking";

// ReviewPage
export const sendReview = "/api/shop/review/post";
export const reviewDelete = "/api/shop/review/delete";
export const reviewList = "/api/shop/review/list";

// MyPage
export const infoUpdate = "/api/mypage/infoUpdate";
export const bookingList = "/api/mypage/bookingList";
export const submitEmployment = "/api/mypage/submit";
export const favoriteList = "/api/mypage/favoriteList";
export const getSchedule = "/api/booking/info";

// DashBoard
export const dashboardInfo = "/api/dashboard/info";
export const shopRequestList = "/api/dashboard/requestList";
export const shopBookingList = "/api/dashboard/bookingList";
export const requestConfirm = "/api/dashboard/requestConfirm";
export const dashboardSave = "/api/dashboard/saveInfo";
export const tmpClear = "/api/dashboard/tmpClear";

// TalkPage
export const roomlist = "/api/talk/roomList";
export const roomEnter = "/api/talk/enter";
export const roomCreate = "/api/talk/create";
export const talkSend = "/api/talk/send";
export const roomLeave = "/api/talk/leave";
export const talkReload = "/api/talk/reload";

// SearchPage
export const search = "/api/shop/search";

// ContactPage
export const contact = "/api/contact/save";