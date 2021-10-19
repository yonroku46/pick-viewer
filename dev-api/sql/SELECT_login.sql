SELECT user_cd,user_email,user_name,user_info,user_img,permission,
JSON_UNQUOTE(JSON_EXTRACT(additional,'$.employment')) as employment
FROM public.m_user
WHERE user_email = ':user_email:'
AND user_pw = ':user_pw:'
AND delete_flag = 0
;