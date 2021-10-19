UPDATE public.m_shop
SET staff_list = CONCAT(staff_list,',',':user_cd:')
WHERE shop_cd = ':shop_cd:'
;