SELECT
    shop_cd,shop_name,shop_location,shop_info,shop_tel,shop_img,shop_open,shop_close,shop_holiday,staff_list,menu_list,ratings_ave,shop_serial,location_lat,location_lng,
    (SELECT COUNT(*) FROM m_shop_review WHERE shop_cd = ':shop_cd:' AND delete_flag = 0 AND review_reply IS NULL) AS review_num,
    (SELECT COUNT(*) FROM m_favorite WHERE shop_cd = ':shop_cd:') AS favorite_num
FROM
    public.m_shop
WHERE
    delete_flag = 0
AND
    shop_cd = ':shop_cd:'
;