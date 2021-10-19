SELECT shop_cd,count(*) as count
FROM public.m_shop
WHERE shop_serial = ':submit_shop_cd:';