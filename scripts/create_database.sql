create table users
(
	id serial not null
		constraint users_pkey
			primary key,
	username varchar(255),
	email varchar(255),
	password varchar(255),
	role integer,
	"createdAt" timestamp with time zone not null,
	"updatedAt" timestamp with time zone not null
);

alter table users owner to postgres;

create table games
(
	id serial not null
		constraint games_pkey
			primary key,
	name varchar(255),
	description varchar(255),
	"createdAt" timestamp with time zone,
	"updatedAt" timestamp with time zone,
	"creatorId" integer
		constraint "games_creatorId_fkey"
			references users
				on update cascade on delete set null
);

alter table games owner to postgres;

create table comments
(
	id serial not null
		constraint comments_pkey
			primary key,
	content varchar(255),
	"createdAt" timestamp with time zone,
	"updatedAt" timestamp with time zone,
	"gameId" integer
		constraint "comments_gameId_fkey"
			references games
				on update cascade on delete set null,
	"userId" integer
		constraint "comments_userId_fkey"
			references users
				on update cascade on delete set null
);

alter table comments owner to postgres;

create table relations
(
	"isBlocked" boolean,
	"createdAt" timestamp with time zone,
	"updatedAt" timestamp with time zone,
	"userId" integer not null
		constraint "relations_userId_fkey"
			references users
				on update cascade on delete cascade,
	"otherId" integer not null
		constraint "relations_otherId_fkey"
			references users
				on update cascade on delete cascade,
	constraint relations_pkey
		primary key ("userId", "otherId")
);

alter table relations owner to postgres;

create table types
(
	id serial not null
		constraint types_pkey
			primary key,
	name varchar(255),
	description varchar(255),
	"createdAt" timestamp with time zone,
	"updatedAt" timestamp with time zone
);

alter table types owner to postgres;

create table users_games
(
	score integer,
	favorite boolean,
	"createdAt" timestamp with time zone,
	"updatedAt" timestamp with time zone not null,
	"gameId" integer not null
		constraint "users_games_gameId_fkey"
			references games
				on update cascade on delete cascade,
	"userId" integer not null
		constraint "users_games_userId_fkey"
			references users
				on update cascade on delete cascade,
	constraint users_games_pkey
		primary key ("gameId", "userId")
);

alter table users_games owner to postgres;

create table types_games
(
	"createdAt" timestamp with time zone not null,
	"updatedAt" timestamp with time zone not null,
	"gameId" integer not null
		constraint "types_games_gameId_fkey"
			references games
				on update cascade on delete cascade,
	"typeId" integer not null
		constraint "types_games_typeId_fkey"
			references types
				on update cascade on delete cascade,
	constraint types_games_pkey
		primary key ("gameId", "typeId")
);

alter table types_games owner to postgres;

