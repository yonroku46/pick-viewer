INSERT INTO public.m_contact
(name,email,category,detail,create_time)
VALUES 
(':name:',':email:',':category:',':detail:',now())
;