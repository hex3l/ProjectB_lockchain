INSERT INTO public."user"
(id, address, username, email, created, updated, "deletedAt") VALUES
(1, '0x3F2a452ca9f216cAd85415B75A7da0130fBB72a6', NULL, NULL, '2023-12-11 18:03:05.678', '2023-12-11 18:03:05.678', NULL),
(2, '0xCbBB720b34dF88AaAcF3D16719a8c1c59FFE7121', NULL, NULL, '2023-12-11 18:03:05.678', '2023-12-11 18:03:05.678', NULL),
(3, '0x71aEB6a9Ba62f9bb637BdD8cef7b2aeC6F9c962e', NULL, NULL, '2023-12-11 18:03:05.678', '2023-12-11 18:03:05.678', NULL),
(4, '0x3afA2A3fA6A1C6f4439D098e5F2622cA9dBFB035', NULL, NULL, '2023-12-11 18:03:05.678', '2023-12-11 18:03:05.678', NULL);

INSERT INTO public.category
(id, "name", created, updated, "deletedAt") VALUES
(1, 'Team effort', '2024-01-28 23:22:50.991', '2024-01-28 23:22:50.991', NULL),
(2, 'Design', '2024-01-28 23:22:50.991', '2024-01-28 23:22:50.991', NULL),
(3, 'Web Dev', '2024-01-28 23:22:50.991', '2024-01-28 23:22:50.991', NULL),
(4, 'Desktop dev', '2024-01-28 23:22:50.991', '2024-01-28 23:22:50.991', NULL),
(5, 'Video Editor', '2024-01-28 23:22:50.991', '2024-01-28 23:22:50.991', NULL);

INSERT INTO public.listing
(id, id_creator, title, description, image, id_category, status, price, created, updated, "deletedAt") VALUES
(1, 1, 'Meme Designer', 'Have you got an idea for a meme? I can make it for you.', '/assets/defaultLogos/x_memeDesigner.png', 1, 0, 0.1, '2024-01-28 23:22:56.953', '2024-01-28 23:22:56.953', NULL),
(2, 2, 'The inspirated Bay', 'Team that can do everything.', '/assets/defaultLogos/x_theInspirateBay.png', 2, 0, 0.45, '2024-01-28 23:22:56.953', '2024-01-28 23:22:56.953', NULL),
(3, 3, 'Pentester', 'Give me your website and I will try to hack it.', '/assets/defaultLogos/x_Pentester.png', 3, 0, 0.5, '2024-01-28 23:22:56.953', '2024-01-28 23:22:56.953', NULL),
(4, 2, 'Pay To Do Nothing', 'Too much money? I can help you.', '/assets/defaultLogos/x_PayToDoNothing.png', 4, 0, 1, '2024-01-28 23:22:56.953', '2024-01-28 23:22:56.953', NULL),
(5, 1, 'Logo Designer', 'Do you need a logo? try this service.', '/assets/defaultLogos/x_LogoDesigner.png', 5, 0, 0.1, '2024-01-28 23:22:56.953', '2024-01-28 23:22:56.953', NULL),
(6, 3, 'Python developer', 'I can develop your Python application.', '/assets/defaultLogos/x_DataBaseManager.png', 1, 0, 0.1, '2024-01-28 23:22:56.953', '2024-01-28 23:22:56.953', NULL),
(7, 1, '.Net Developer', 'I can develop your .Net application.', '/assets/defaultLogos/x_dotNetDeveloper.png', 2, 0, 0.2, '2024-01-28 23:22:56.953', '2024-01-28 23:22:56.953', NULL),
(8, 3, 'Not Ready', 'Not Ready', '/assets/defaultLogos/x_NotReady.png', 3, 0, 0.1, '2024-01-28 23:22:56.953', '2024-01-28 23:22:56.953', NULL),
(9, 1, 'DataBase Manager', 'Need to store data? This is the service for you.', '/assets/defaultLogos/x_DataBaseManager.png', 4, 0, 0.1, '2024-01-28 23:22:56.953', '2024-01-28 23:22:56.953', NULL),
(10, 2, 'Solidity Contract Developer', 'I can develop your Solidity contract.', '/assets/defaultLogos/x_solidityContractDeveloper.png', 5, 0, 0.5, '2024-01-28 23:22:56.953', '2024-01-28 23:22:56.953', NULL),
(11, 2, 'Oufit Maker', 'Send me a photo and I will make you an outfit.', '/assets/defaultLogos/X_OutfitMaker.png', 3, 0, 0.1, '2024-01-28 23:22:56.953', '2024-01-28 23:22:56.953', NULL),
(12, 1, 'Plumber service', 'Plumber for you and your wife', '/assets/defaultLogos/x_plumber.png', 3, 0, 0.1, '2024-01-28 23:22:56.953', '2024-01-28 23:22:56.953', NULL);
