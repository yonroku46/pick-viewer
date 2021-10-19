UPDATE public.m_user
SET pin = NULL
WHERE user_email = ':user_email:'
;