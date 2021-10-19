SELECT shop_cd,shop_name,shop_location,shop_info,shop_tel,shop_img,ratings_ave
FROM public.m_shop
WHERE delete_flag = 0
AND shop_serial LIKE ':category:%'
;