UPDATE public.m_shop
SET staff_list = REPLACE(staff_list,':user_cd:','')
WHERE shop_cd = ':shop_cd:'
;