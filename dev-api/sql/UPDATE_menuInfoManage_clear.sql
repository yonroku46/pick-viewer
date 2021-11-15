UPDATE
    public.m_shop
SET
	staff_list = REPLACE(staff_list, ',,' , ','),
    staff_list = IF((LEFT(staff_list,1) REGEXP ('^[0-9]+$')),
	    staff_list,
	    SUBSTRING(staff_list FROM 2 FOR CHAR_LENGTH(staff_list))),
    staff_list = IF((RIGHT(staff_list,1) REGEXP ('^[0-9]+$')),
	    staff_list,
	    SUBSTRING(staff_list FROM 1 FOR CHAR_LENGTH(staff_list) - 1)),
	menu_list = REPLACE(menu_list, ',,' , ','),
    menu_list = IF((LEFT(menu_list,1) REGEXP ('^[0-9]+$')),
	    menu_list,
	    SUBSTRING(menu_list FROM 2 FOR CHAR_LENGTH(menu_list))),
    menu_list = IF((RIGHT(menu_list,1) REGEXP ('^[0-9]+$')),
	    menu_list,
	    SUBSTRING(menu_list FROM 1 FOR CHAR_LENGTH(menu_list) - 1))
WHERE
    shop_cd = ':shop_cd:'
;