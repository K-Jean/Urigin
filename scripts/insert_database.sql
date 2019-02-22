INSERT INTO public.users (username, email, password, role, "createdAt", "updatedAt") VALUES ('kevinette', 'user@admin.fr', '$2b$10$JkOghu0dnATmLvcMlwi.6OE2eDi7C1uE88V11ESFtRMo1hLA/9PsC', 0, '2019-02-21 22:07:40.707000', '2019-02-21 22:07:40.707000');
INSERT INTO public.users (username, email, password, role, "createdAt", "updatedAt") VALUES ('arthurette', 'admin@admin.fr', '$2b$10$JkOghu0dnATmLvcMlwi.6OE2eDi7C1uE88V11ESFtRMo1hLA/9PsC', 1, '2019-02-21 22:07:40.707000', '2019-02-21 22:07:40.707000');
INSERT INTO public.users (username, email, password, role, "createdAt", "updatedAt") VALUES ('rafaette', 'creator@admin.fr', '$2b$10$JkOghu0dnATmLvcMlwi.6OE2eDi7C1uE88V11ESFtRMo1hLA/9PsC', 2, '2019-02-21 22:07:40.707000', '2019-02-21 22:07:40.707000');

INSERT INTO public.games (name, description, "createdAt", "updatedAt", "creatorId") VALUES ('batman', 'the best game EUW', '2019-02-21 22:08:03.417000', '2019-02-21 22:08:03.417000', 3);
INSERT INTO public.games (name, description, "createdAt", "updatedAt", "creatorId") VALUES ('GTA', 'kill des gens on est content', '2019-02-21 22:08:03.417000', '2019-02-21 22:08:03.417000', 3);

INSERT INTO public.types (name, description, "createdAt", "updatedAt") VALUES ('Action', 'Ceci est un type où il faut être fort', '2019-02-21 22:08:35.447000', '2019-02-21 22:08:35.447000');
INSERT INTO public.types (name, description, "createdAt", "updatedAt") VALUES ('Aventure', 'Ceci est un type où il faut être agile', '2019-02-21 22:08:35.447000', '2019-02-21 22:08:35.447000');

INSERT INTO public.types_games ("createdAt", "updatedAt", "gameId", "typeId") VALUES ('2019-02-21 22:56:25.015000', '2019-02-21 22:56:25.015000', 1, 1);
INSERT INTO public.types_games ("createdAt", "updatedAt", "gameId", "typeId") VALUES ('2019-02-21 22:56:25.015000', '2019-02-21 22:56:25.015000', 1, 2);

INSERT INTO public.types_games ("createdAt", "updatedAt", "gameId", "typeId") VALUES ('2019-02-21 22:56:25.015000', '2019-02-21 22:56:25.015000', 2, 1);

INSERT INTO public.users_games (score, favorite, "createdAt", "updatedAt", "gameId", "userId") VALUES (5, true, '2019-02-22 09:32:54.227000', '2019-02-22 09:32:56.662000', 1, 1);
INSERT INTO public.users_games (score, favorite, "createdAt", "updatedAt", "gameId", "userId") VALUES (4, false, '2019-02-22 09:33:16.055000', '2019-02-22 09:33:20.878000', 2, 1);

INSERT INTO public.relations ("isBlocked", "createdAt", "updatedAt", "userId", "otherId") VALUES (true, '2019-02-21 23:17:13.008000', '2019-02-21 23:17:13.008000', 1, 3);

INSERT INTO public.comments (content, "createdAt", "updatedAt", "gameId", "userId") VALUES ('Jaime bien ce jeu mais un peu moyen', '2019-02-21 22:08:16.511000', '2019-02-21 22:08:16.511000', 1, 1);
INSERT INTO public.comments (content, "createdAt", "updatedAt", "gameId", "userId") VALUES ('Finalement cest plutot nul', '2019-02-21 22:08:16.511000', '2019-02-21 22:08:16.511000', 1, 1);