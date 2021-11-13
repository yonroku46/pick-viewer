UPDATE
    public.m_shop
SET
    menu_list = CONCAT(menu_list,',',':menu_cd:')
WHERE
    shop_cd = ':shop_cd:'
;