import { Elysia, t } from 'elysia';
import { html } from '@elysiajs/html'
import { usersController } from "./controllers/users.controller";
import './database/db.setup.ts'
import { swagger } from '@elysiajs/swagger'
import { helmet } from "elysia-helmet";
import { basicAuth } from '@eelkevdbos/elysia-basic-auth'

process.env["BASIC_AUTH_CREDENTIALS"] = process.env.BASIC_AUTH_CREDENTIALS

const app = new Elysia();

// AUTHENTICATION
app.use(basicAuth())
    // all routes are protected by default
app.get("/", () => "private")
    // access to realm within a handler
app.get('/private/realm-stored', ({ store }) => store.basicAuthRealm)

// HTML
app.use(html());

// SWAGGER
app.use(swagger({
    path: '/swagger',
    documentation: {
        info: {
            title: 'Bun.js CRUD app with Elysia.js',
            version: '1.0.0',
        },
        tags: [
            { name: 'PUBLIC', description: 'Public elements' },
            { name: 'CRUD', description: 'CRUD elements' },
        ]
    }
}))

// INDEX ROUTE
app.get("/", () => Bun.file("src/index.html"), {
    detail: {
        summary: 'Get index page',
        tags: ['PUBLIC']
    }
})

app.get("/script.js", () => Bun.file("src/script.js"))

app.use(usersController)

app.use(helmet({
    contentSecurityPolicy: false,
    XContentTypeOptions: false,
    StrictTransportSecurity: false
})).listen(3000);