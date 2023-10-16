// import { Elysia } from "elysia";
//
// const app = new Elysia().get("/", () => "Hello Elysia").listen(3000);
//
// console.log(
//   `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
// );

import { Elysia, t } from 'elysia';
import { html } from '@elysiajs/html'
import { BooksDatabase } from './db.js';

new Elysia()
    .use(html())
    .decorate("db", new BooksDatabase())
    .get("/", () => Bun.file("src/index.html").text())
    .get("/script.js", () => Bun.file("src/script.js").text())
    .get("/books", ({ db }) => db.getBooks())
    .post(
        "/books",
        async ({ db, body }) => {
            const id = (await db.addBook(body)).id
            return { success: true, id };
        },
        {
            schema: {
                body: t.Object({
                    name: t.String(),
                    author: t.String(),
                }),
            },
        }
    )
    .put(
        "/books/:id",
        ({ db, params, body }) => {
            try {
                db.updateBook(parseInt(params.id), body)
                return { success: true };
            } catch (e) {
                return { success: false };
            }
        },
        {
            schema: {
                body: t.Object({
                    name: t.String(),
                    author: t.String(),
                }),
            },
        }
    )
    .delete("/books/:id", ({ db, params }) => {
        try {
            db.deleteBook(parseInt(params.id))
            return { success: true };
        } catch (e) {
            return { success: false };
        }
    })
    .listen(3000);