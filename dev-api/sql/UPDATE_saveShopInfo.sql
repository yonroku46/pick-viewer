UPDATE
    public.m_shop
SET
    shop_location = ':shop_location:',
    shop_info = ':shop_info:',
    shop_tel = ':shop_tel:',
    shop_img = ':shop_img:',
    shop_open = ':shop_open:',
    shop_close = ':shop_close:',
    shop_holiday = ':shop_holiday:',
    location_lat = ':location_lat:',
    location_lng = ':location_lng:'
WHERE shop_cd = ':shop_cd:'
;