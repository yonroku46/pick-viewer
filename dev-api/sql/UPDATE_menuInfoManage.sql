UPDATE
    public.m_menu
SET
    menu_category = ':menu_category:',
    menu_name = ':menu_name:',
    menu_description = ':menu_description:',
    menu_price = ':menu_price:',
    menu_img = ':menu_img:'
WHERE
    menu_cd = ':menu_cd:'
;