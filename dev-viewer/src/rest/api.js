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
export const bookingCheck = "/api/bookingCheck";

// SignupPage
export const mailService = "/api/mailService";
export const certifiService = "/api/certifiService";
export const signup = "/api/signup";

// HelpPage
export const helpService = "/api/helpService";
export const resetService = "/api/resetService";

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
export const getSchedule = "/api/getSchedule";

// DashBoard
export const dashboardInfo = "/api/dashboard/info";
export const shopRequestList = "/api/dashboard/requestList";
export const shopBookingList = "/api/shopBookingList";
export const requestConfirm = "/api/dashboard/requestConfirm";
export const saveShopInfo = "/api/saveShopInfo";
export const imgClear = "/api/imgClear";

// SearchPage
export const search = "/api/shop/search";

// ContactPage
export const contact = "/api/contact";