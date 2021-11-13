SELECT
    menu_cd
FROM
    public.m_menu
WHERE
    shop_cd = ':shop_cd:' AND delete_flag = ':pin:'
;