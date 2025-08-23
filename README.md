# Blog App fullstack

This is my first full-stack app — a simple blogging platform with user authentication, where you can create posts, leave comments, like content, and even upload your own avatar!

## Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas cluster)

---

## Setup & Installation

```bash
# clone repo
git clone https://github.com/ammar-elmesaly/blog-app.git
cd blog-app

# install dependencies
npm install

# copy env template
cp sample.env .env
# edit .env -> MONGO_URI, PORT, SECRET
```

## Features

**Authentication**: Signup/login/logout with secure sessions.

**Blog posts**: Create, edit, delete, and list posts.

**Likes**: Posts and comments can be liked by users.

**Comments**: Users can comment on posts (todo).

**Avatars**: Upload and display profile images.
