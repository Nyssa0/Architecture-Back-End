import { Elysia, t } from 'elysia';
import User, { IUser } from '../models/user.schema';

export const usersController = (app: Elysia) =>
    app.group("/users", (app: Elysia) => app
        // GET ALL USERS
        // GET /users/get
        .get('/get', async ({ set }: Elysia.Set) => {
            try {
                const users = await User.find({});
                return users;
            } catch (e: unknown) {
                set.status = 500;
                return {
                    message: 'Unable to retrieve items from the database!',
                    status: 500,
                };
            }

        },
            {
                detail: {
                    summary: 'Get all users',
                    tags: ['CRUD']
                }
            }
        )

        // CREATE A NEW USER
        // POST /users/post
        .post('/post', async (handler: Elysia.Handler) => {
            try {
                const newUser = new User();
                newUser.username = handler.body.username;
                newUser.email = handler.body.email;
                newUser.password = handler.body.password;

                const savedUser = await newUser.save();

                handler.set.status = 201;

                return newUser;
            } catch (e: any) {
                // If unique mongoose constraint (for username or email) is violated
                if (e.name === 'MongoServerError' && e.code === 11000) {
                    handler.set.status = 422;
                    return {
                        message: 'Resource already exists!',
                        status: 422,
                    };
                }

                handler.set.status = 500;
                return {
                    message: 'Unable to save entry to the database!',
                    status: 500,
                };
            }
        },
        {
            detail: {
                summary: 'Create a new user',
                tags: ['CRUD']
            }
        },
            {
            onError(handler: Elysia.Handler) {
                console.log(`wwwwwww  Handler - Status Code: ${handler.set.status}`);
            }
        })

        // GET A USER BY ID
        // GET /users/get/:id
        .get('get/:id', async (handler: Elysia.Handler) => {
            try {
                const { id } = handler.params;

                const existingUser = await User.findById(id);

                if (!existingUser) {
                    handler.set.status = 404;
                    return {
                        message: 'Requested resource was not found!',
                        status: 404,
                    };
                }

                return existingUser;
            } catch (e: unknown) {
                handler.set.status = 500;
                return {
                    message: 'Unable to retrieve the resource!',
                    status: 500,
                };
            }
        },
        {
            detail: {
                summary: 'Get a user by id',
                tags: ['CRUD']
            }
        })

        // UPDATE A USER BY ID
        // PUT /users/put/:id
        .patch('/patch/:id', async (handler: Elysia.Handler) => {
            try {
                const { id } = handler.params;

                const changes: Partial<IUser> = handler.body;

                const updatedUser = await User.findOneAndUpdate(
                    { _id: id },
                    { $set: { ...changes } },
                    { new: true }
                );

                if (!updatedUser) {
                    handler.set.status = 404;
                    return {
                        message: `User with id: ${id} was not found.`,
                        status: 404,
                    };
                }

                return updatedUser;
            } catch (e: unknown) {
                handler.set.status = 500;
                return {
                    message: 'Unable to update resource!',
                    status: 500,
                };
            }
        },
        {
            detail: {
                summary: 'Update a user by id',
                tags: ['CRUD']
            }
        })

        // DELETE A USER BY ID
        // DELETE /users/delete/:id
        .delete('/delete/:id', async (handler: Elysia.Handler) => {
            try {
                const { id } = handler.params;

                const existingUser = await User.findById(id);

                if (!existingUser) {
                    handler.set.status = 404;
                    return {
                        message: `User with id: ${id} was not found.`,
                        status: 404,
                    };
                }

                await User.findOneAndRemove({ _id: id });

                return {
                    message: `Resource deleted successfully!`,
                    status: 200,
                };
            } catch (e: unknown) {
                handler.set.status = 500;
                return {
                    message: 'Unable to delete resource!',
                    status: 500,
                };
            }
        },
        {
            detail: {
                summary: 'Delete a user by id',
                tags: ['CRUD']
            }
        })
    )