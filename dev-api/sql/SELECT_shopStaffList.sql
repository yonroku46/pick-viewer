SELECT user_cd,user_name,user_img,
JSON_UNQUOTE(JSON_EXTRACT(additional,'$.career')) AS career,
JSON_UNQUOTE(JSON_EXTRACT(additional,'$.info')) AS info
FROM public.m_user 
WHERE user_cd IN (':staff_list:');