CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);

insert into blogs (author, url, title) values ('Mimosa Koskinen', 'http://url1.com', 'blog1');
insert into blogs (author, url, title) values ('Leena Suomalainen', 'http://url2.com', 'blog2');