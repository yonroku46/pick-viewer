SELECT
msr.request_cd,msr.request_time,
mu.user_cd,mu.user_name,mu.user_email,mu.user_img
FROM public.m_shop_request msr
INNER JOIN public.m_user mu
ON msr.user_cd = mu.user_cd 
WHERE msr.shop_cd = ':shop_cd:' AND request_stat = 0;