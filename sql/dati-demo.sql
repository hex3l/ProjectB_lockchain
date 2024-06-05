INSERT INTO public."user"
(id, address, username, email, created, updated, "deletedAt") VALUES
(1, '0xbB2095532dE259FDf3a4Af484eF4de0E080bCa4C', NULL, NULL, '2023-12-11 18:03:05.678', '2023-12-11 18:03:05.678', NULL),
(2, '0x3afA2A3fA6A1C6f4439D098e5F2622cA9dBFB035', NULL, NULL, '2023-12-11 18:03:05.678', '2023-12-11 18:03:05.678', NULL),
(3, '0x71aEB6a9Ba62f9bb637BdD8cef7b2aeC6F9c962e', NULL, NULL, '2023-12-11 18:03:05.678', '2023-12-11 18:03:05.678', NULL);

INSERT INTO public.category
(id, "name", created, updated, "deletedAt") VALUES
(1, 'Social Media', '2024-01-28 23:22:50.991', '2024-01-28 23:22:50.991', NULL),
(2, 'WordPress', '2024-01-28 23:22:50.991', '2024-01-28 23:22:50.991', NULL),
(3, 'Traslater', '2024-01-28 23:22:50.991', '2024-01-28 23:22:50.991', NULL),
(4, 'AI Artist', '2024-01-28 23:22:50.991', '2024-01-28 23:22:50.991', NULL),
(5, 'Video Editor', '2024-01-28 23:22:50.991', '2024-01-28 23:22:50.991', NULL),
(6, 'Graphics', '2024-01-28 23:22:50.991', '2024-01-28 23:22:50.991', NULL),
(7, 'Software', '2024-01-28 23:22:50.991', '2024-01-28 23:22:50.991', NULL),
(8, 'Other', '2024-01-28 23:22:50.991', '2024-01-28 23:22:50.991', NULL);

INSERT INTO public.listing
(id, id_creator, title, description, image, id_category, status, price, created, updated, "deletedAt") VALUES
(1, 1, 'Meme Designer', 'Have you got an idea for a meme? I can make it for you.', '/assets/defaultLogos/x_memeDesigner.png', 6, 1, 0.1, '2024-01-28 23:22:56.953', '2024-01-28 23:22:56.953', NULL),
(2, 2, 'The inspirated Bay', 'Team that can do everything.', '/assets/defaultLogos/x_theInspirateBay.png', 7, 1, 0.45, '2024-01-28 23:22:56.953', '2024-01-28 23:22:56.953', NULL),
(3, 3, 'Pentester', 'Give me your website and I will try to hack it.', '/assets/defaultLogos/x_Pentester.png', 7, 1, 0.5, '2024-01-28 23:22:56.953', '2024-01-28 23:22:56.953', NULL),
(4, 2, 'Pay To Do Nothing', 'Too much money? I can help you.', '/assets/defaultLogos/x_PayToDoNothing.png', 8, 1, 1, '2024-01-28 23:22:56.953', '2024-01-28 23:22:56.953', NULL),
(5, 1, 'Logo Designer', 'Do you need a logo? try this service.', '/assets/defaultLogos/x_LogoDesigner.png', 6, 1, 0.1, '2024-01-28 23:22:56.953', '2024-01-28 23:22:56.953', NULL),
(6, 3, 'Python developer', 'I can develop your Python application.', '/assets/defaultLogos/x_PythonDeveloper.png', 7, 1, 0.1, '2024-01-28 23:22:56.953', '2024-01-28 23:22:56.953', NULL),
(7, 1, '.Net Developer', 'I can develop your .Net application.', '/assets/defaultLogos/x_dotNetDeveloper.png', 7, 1, 0.2, '2024-01-28 23:22:56.953', '2024-01-28 23:22:56.953', NULL),
(8, 3, 'Not Ready', 'Not Ready', '/assets/defaultLogos/x_NotReady.png', 8, 1, 0.1, '2024-01-28 23:22:56.953', '2024-01-28 23:22:56.953', NULL),
(9, 1, 'DataBase Manager', 'Need to store data? This is the service for you.', '/assets/defaultLogos/x_DataBaseManager.png', 2, 1, 0.1, '2024-01-28 23:22:56.953', '2024-01-28 23:22:56.953', NULL),
(10, 2, 'Solidity Contract Developer', 'I can develop your Solidity contract.', '/assets/defaultLogos/x_solidityContractDeveloper.png', 7, 1, 0.5, '2024-01-28 23:22:56.953', '2024-01-28 23:22:56.953', NULL),
(11, 2, 'Oufit Maker', 'Send me a photo and I will make you an outfit.', '/assets/defaultLogos/X_OutfitMaker.png', 8, 1, 0.1, '2024-01-28 23:22:56.953', '2024-01-28 23:22:56.953', NULL),
(12, 1, 'Plumber service', 'Plumber for you and your wife', '/assets/defaultLogos/x_plumber.png', 8, 1, 0.1, '2024-01-28 23:22:56.953', '2024-01-28 23:22:56.953', NULL),
(13, 3, 'AI Artist', 'I can make you an AI image.', '/assets/defaultLogos/ai_artist.png', 4, 1, 0.1, '2024-01-28 23:22:56.953', '2024-01-28 23:22:56.953', NULL),
(14, 1, 'Ciak si Gira', 'Edit your video is easier.', '/assets/defaultLogos/ciak.png', 5, 1, 0.3, '2024-01-28 23:22:56.953', '2024-01-28 23:22:56.953', NULL),
(15, 2, 'Traslater', 'I can traslate your chinmese text.', '/assets/defaultLogos/traslator.png', 3, 1, 0.2, '2024-01-28 23:22:56.953', '2024-01-28 23:22:56.953', NULL),
(16, 3, 'WordPress Developer', 'Your WordPress website in 5 minutes...hours...years :).', '/assets/defaultLogos/wordpress.png', 2, 1, 0.2, '2024-01-28 23:22:56.953', '2024-01-28 23:22:56.953', NULL),
(17, 1, 'Pippo Franco ', 'Manager for your social.', '/assets/defaultLogos/smm.png', 1, 1, 0.2, '2024-01-28 23:22:56.953', '2024-01-28 23:22:56.953', NULL),
(18, 2, 'Mohamed japan tutor', 'Japan tutor', '/assets/defaultLogos/japan_tutor.png', 3, 1, 0.5, '2024-01-28 23:22:56.953', '2024-01-28 23:22:56.953', NULL),
(19, 1, 'Zofai Instagram manager', 'I can manage your instagram page.', '/assets/defaultLogos/Instagramm.png', 1, 1, 0.2, '2024-01-28 23:22:56.953', '2024-01-28 23:22:56.953', NULL),
(20, 2, 'Music artist', 'music artist using ai', '/assets/defaultLogos/aimusic.png', 4, 1, 0.01, '2024-01-28 23:22:56.953', '2024-01-28 23:22:56.953', NULL),
(21, 3, 'Not human company', 'Give me a question and i ask you using chatgpt.', '/assets/defaultLogos/Fake_ai.png', 4, 1, 0.1, '2024-01-28 23:22:56.953', '2024-01-28 23:22:56.953', NULL),
(22, 1, 'Best Edit ever', 'Just a simple photo editor', '/assets/defaultLogos/photo_editor.png', 6, 1, 0.1, '2024-01-28 23:22:56.953', '2024-01-28 23:22:56.953', NULL);
