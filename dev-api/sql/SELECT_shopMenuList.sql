SELECT menu_cd,menu_category,menu_name,menu_description,menu_price,menu_img
FROM public.m_menu
WHERE shop_cd = ':shop_cd:'
AND menu_cd IN (':menu_list:');