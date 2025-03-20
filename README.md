# Full-stack web developer technical assessment

## Overview

Create a simple micro-blogging app with the following entities / models:

* User
  * name
  * email
* Post
  * content

A user **has many** posts that they have authored.

Feel free to add any fields to the above that make sense for this use case and the corresponding validations.

See [Note 1](#note-1)

### Allowed operations

A user can:

* read all posts
* create a new post
* delete their own post

An unauthenticated user can:

* read all posts

The index of posts should show:

* the post content
* author name
* creation timestamp

Implement all endpoints and components to facilitate the above functionality.

### Desired stack

The stack will need to be fully Typescript-based.

The front-end will need to be an SPA (Single Page Application) implemented using any popular front end framework, but [React](https://react.dev/) would be preferable. For your convenience you can use the starter found in the `microblog-front` folder.

The back-end should be an API server backed by a relational database (RDBMS), ideally [Postgres](https://www.postgresql.org/).

### Authentication

The users need to be able to log in & out.

You can skip sign-up functionality and just seed the db with some test users if you like.

There is also no need to roll your own auth, feel free to use a service such as [Clerk](https://clerk.com/) or a free OSS alternative like [AuthJS](https://authjs.dev/).


## Deliverables

### Required

One clone of this repo with:

* The front-end SPA
* The backend-end API
* A readme `INSTRUCTIONS.md` with instructions on how to build & run the app
* A test plan [See Note](#note-2)

Once you are ready to share your work, you can invite the following github handles to your repo(s):

* [xeroxoid](https://github.com/xeroxoid)
* [your_tallness](https://github.com/your_tallness)


### Nice-to-have

* Live updates
* A deployed demo of the app
* Monorepo architecture
* Dockerization


## NOTES

### NOTE 1

You are encouraged to use as much GenAI (ChatGPT, Claude, CoPilot, Cursor) as you like to bootstrap the project, we realize that even a basic full-stack app is a lot of work and any manner of avoiding writing boilerplate is most welcome.

For any clarifications, do not hesitate to contact us: [Milt](mailto:miltiadis@100mentors.com) and/or [Mark](mailto:mark.pitsilos@100mentors.com)

### NOTE 2

Creating a test suite is not necessary, but do provide a plan (as bullet points) of the tests you would implement to provide sufficient coverage for the project.

The test plan could also be part of the repo in the form of skipped tests, e.g.:

```typescript
it.skip('a user should be able to read their own post', () => {});
```
