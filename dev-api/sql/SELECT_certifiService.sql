SELECT count(*) as count
FROM public.m_user
WHERE user_email = ':user_email:' AND pin = ':certifi:';