--
-- PostgreSQL database dump
--

\restrict tOgm8kiUC5OrbnNkFIILsw0la7xvgDYeOag2Qa5YkEeivDg96pVguDwR2ir4aUC

-- Dumped from database version 15.15
-- Dumped by pg_dump version 15.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: cau_thai_images; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cau_thai_images (id, thai_id, year, image_url, title, lunar_label, is_featured, created_at, khung_id, is_active, description) FROM stdin;
\.


--
-- Data for Name: community_posts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.community_posts (id, thai_id, youtube_id, title, content, like_count, is_pinned, is_approved, created_at) FROM stdin;
7d13d866-0f95-4a32-b33d-67b4d9e873db	an-nhon	6g9RdLC3U8o	Test thử	Video Cổ Nhơn nhưng éo liên quan Cổ Nhơn	1	f	t	2026-02-05 02:50:59.896311
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, phone, password_hash, name, zalo, bank_code, bank_account, bank_holder, role, completed_tasks, created_at, is_comment_banned) FROM stdin;
f37c762e-dcb8-4521-9f57-e6253b56deaf	0932433459	$2a$10$rizG7a40v9jBLoAzwyerS.u5FMJ7Yn/S0/Ka3m1OZIwneenNWB8Fu	Admin	\N	VCB	91222222345	Viet Tester	admin	{task-1,task-2,task-3,task-4,task-5,task-6}	2026-02-03 09:35:53.757891	f
836be5cd-7d3f-4a1d-9854-a975217091d8	0332697909	.u5FMJ7Yn/S0/Ka3m1OZIwneenNWB8Fu	Admin	\N	\N	\N	\N	admin	{}	2026-02-07 14:41:42.380826	f
\.


--
-- Data for Name: community_comments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.community_comments (id, post_id, user_id, user_name, user_phone, content, created_at) FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sessions (id, thai_id, session_type, session_date, lunar_label, status, winning_animal, cau_thai, created_at, draw_time) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orders (id, session_id, user_id, total, status, payment_code, payment_url, payment_expires, created_at, paid_at) FROM stdin;
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_items (id, order_id, animal_order, animal_name, quantity, unit_price, subtotal) FROM stdin;
\.


--
-- Data for Name: post_likes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.post_likes (post_id, user_id, created_at) FROM stdin;
7d13d866-0f95-4a32-b33d-67b4d9e873db	f37c762e-dcb8-4521-9f57-e6253b56deaf	2026-02-05 03:16:14.135991
\.


--
-- Data for Name: session_animals; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.session_animals (session_id, animal_order, limit_amount, sold_amount, is_banned, ban_reason) FROM stdin;
\.


--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.settings (id, key, value, updated_at) FROM stdin;
9161fe1e-d324-4e74-9839-2da2fba9789e	tet_mode	false	2026-02-03 09:35:08.504159
c9a764e6-2834-4345-a69d-26debb8703ae	schedule_an_nhon	{"slot1": {"close_time": "10:30", "start_time": "07:00"}, "slot2": {"close_time": "16:30", "start_time": "12:00"}, "slot3": {"close_time": "20:30", "start_time": "18:00"}}	2026-02-03 09:35:08.504159
7826b84f-2b53-4c60-aa96-b5effd5ba73e	schedule_nhon_phong	{"slot1": {"close_time": "10:30", "start_time": "07:00"}, "slot2": {"close_time": "16:30", "start_time": "12:00"}}	2026-02-03 09:35:08.504159
a0c0ec34-2e84-405b-9d7f-0f06e438b3a8	schedule_hoai_nhon	{"slot1": {"close_time": "12:30", "start_time": "09:00"}, "slot2": {"close_time": "18:30", "start_time": "14:00"}}	2026-02-03 09:35:08.504159
5502c8a9-381e-4fd8-b7cf-f4c90ec9624b	thai_hoai_nhon_enabled	true	2026-02-05 06:45:13.738797
f0fe8b51-f68d-45f2-a375-354c7b647e66	master_switch	true	2026-02-05 07:37:30.411311
cafa521c-1d92-4ade-a044-2c2e15aee7b4	thai_an_nhon_enabled	true	2026-02-05 06:58:05.510045
243014d4-dcb2-4cc7-adb5-3d4a82768217	thai_nhon_phong_enabled	true	2026-02-05 06:58:04.778781
9bec378b-8460-4158-8eba-27a1fd81e40f	thai_limits	{"an-nhon": 300000, "hoai-nhon": 200000, "nhon-phong": 500000}	2026-02-07 10:07:33.903265
e5c90c1f-abfe-4280-a1f2-8704d63f7ee1	thai_configs	[{"id": "thai-an-nhon", "name": "Thai An Nhơn", "slug": "an-nhon", "times": ["10:30", "16:30"], "isOpen": true, "isTetMode": false, "timeSlots": [{"endTime": "10:30", "startTime": "07:10"}, {"endTime": "16:30", "startTime": "12:00"}], "description": "Khu vực An Nhơn - Bình Định", "tetTimeSlot": {"endTime": "20:30", "startTime": "18:00"}}, {"id": "thai-nhon-phong", "name": "Thai Nhơn Phong", "slug": "nhon-phong", "times": ["11:00", "17:00"], "isOpen": true, "isTetMode": false, "timeSlots": [{"endTime": "10:30", "startTime": "07:00"}, {"endTime": "16:30", "startTime": "12:00"}], "description": "Khu vực Nhơn Phong"}, {"id": "thai-hoai-nhon", "name": "Thai Hoài Nhơn", "slug": "hoai-nhon", "times": ["13:00", "19:00"], "isOpen": true, "isTetMode": false, "timeSlots": [{"endTime": "12:30", "startTime": "09:00"}, {"endTime": "18:30", "startTime": "14:00"}], "description": "Khu vực Hoài Nhơn"}]	2026-02-07 10:14:08.451365
cdda231a-cf60-4035-be5a-4e127e8ac094	maintenance_message	"Hệ thống Cổ Nhơn đang trong mùa nghỉ. Hẹn gặp lại vào Tết năm sau!"	2026-02-03 09:35:08.504159
\.


--
-- PostgreSQL database dump complete
--

\unrestrict tOgm8kiUC5OrbnNkFIILsw0la7xvgDYeOag2Qa5YkEeivDg96pVguDwR2ir4aUC

