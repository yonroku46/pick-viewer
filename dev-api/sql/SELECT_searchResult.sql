SELECT shop_cd,shop_name,shop_location,shop_info,shop_tel,shop_img,ratings_ave
FROM (
    SELECT * FROM public.m_shop WHERE shop_name LIKE '%:value:%' UNION 
    SELECT * FROM public.m_shop WHERE shop_location LIKE '%:value:%' UNION 
    SELECT * FROM public.m_shop WHERE shop_info LIKE '%:value:%'
    ) sub1
WHERE sub1.delete_flag = 0
AND sub1.shop_serial LIKE ':category:%'
;