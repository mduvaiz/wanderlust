# Wanderlust

A full-stack property listing application inspired by Airbnb, built with Node.js, Express 5, MongoDB and EJS. Users can sign up, create property listings, and review stays. Listing owners control their own content, with server-side authentication and authorisation.

## Features

- User signup, login and logout with bcrypt-hashed passwords
- Create, edit and delete listings with owner-only access
- Create and delete reviews with author-only access
- Flash messages, server-side validation, custom 404 and error pages
- Redirect to the originally requested page after login

## Tech Stack

- **Backend:** Node.js, Express 5
- **Database:** MongoDB, Mongoose
- **Views:** EJS, ejs-mate, Bootstrap
- **Authentication and sessions:** bcrypt, express-session
- **Validation and security:** Joi, Helmet, express-rate-limit
- **Other:** connect-flash

## Security and Access Control

- **Password security:** Passwords are hashed with bcrypt rather than stored in plain text.
- **Session fixation:** The session ID is regenerated on login, with the intended return URL preserved across regeneration.
- **Redirect validation:** Return URLs are restricted to same-site relative paths.
- **Authorisation:** Authentication and ownership middleware protect listing and review operations. Ownership is checked against database records rather than trusted form fields.
- **Mass assignment:** Listing and review routes use explicit field whitelists to prevent clients from assigning protected fields.
- **Data exposure:** Populated owner and author information is restricted to the fields required by the views.
- **Rate limiting:** Login and signup endpoints have configured request limits.
- **Session cookies:** Session cookies use HttpOnly and SameSite=Lax settings.
- **Configuration:** Required environment variables are validated at startup.
- **Input validation:** Joi schemas validate authentication, listing and review input.
- **Manual testing:** Security checks include cross-user edit/delete attempts, ownership-reassignment attempts, unauthenticated requests, malicious login input and rate-limit behaviour.

## Known Limitations

- **CSRF protection:** No CSRF token is implemented. SameSite=Lax provides some protection against cross-site requests but is not a substitute for evaluating and implementing appropriate CSRF defences.
- **Session storage:** The default in-memory session store is unsuitable for production deployment. A persistent store such as connect-mongo should be configured.
- **Rate-limit storage:** In-memory rate-limit counters reset on restart and are not shared across application instances.
- **Content Security Policy:** CSP is currently disabled and should be reviewed before deployment.
- **Input sanitisation:** Joi validation does not replace database-specific protections or context-appropriate output encoding. No separate MongoDB operator-sanitisation layer is configured.
- **Username handling:** Usernames are case-sensitive.

This project is intended as a learning and portfolio project. The limitations above should be addressed and tested before production deployment.

## Run Locally

1. Install dependencies:

   `npm install`

2. Create a `.env` file with the required variables:

   | Variable | Purpose |
   | --- | --- |
   | `MONGO_URL` | MongoDB connection string |
   | `SESSION_SECRET` | Long, random session-signing secret |
   | `PORT` | Application port, for example `8080` |

3. Start the application:

   `node app.js`

4. Open `http://localhost:8080/listings` in your browser.

