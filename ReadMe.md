# HTMx Todo Tutorial

This code contains the code for a blog post series I wrote on learning HTMx using Express and Firebase.

1. [Part I - Setting up](https://www.marcusoft.net/2025/01/htmx-todo-tutorial.html)
1. [Part II - Google Authentication](https://www.marcusoft.net/2025/01/htmx-todo-tutorial-II.html)
1. [Part III - Building the app](https://www.marcusoft.net/2025/01/htmx-todo-tutorial-III.html)
1. [Part IV - Advanced updates](https://www.marcusoft.net/2025/01/htmx-todo-tutorial-IV.html)
1. [Part V - Validation](https://www.marcusoft.net/2025/01/htmx-todo-tutorial-V.html)

## Tools

To build this I have used:

* Express
* Firebase (Authentication and storage)
* EJS Templates
* HTMx

## Get this to run

1. Create a [Firebase project](https://console.firebase.google.com/)
    * Enable authentication - and copy the Google Client Id
    * Enable Firestore - and copy the configuration
1. Clone the this repository
    * `git clone https://github.com/marcusoftnet/htmx-todo-tutorial && cd htmx-todo-tutorial`
1. Install the dependencies
    * `npm install`
1. Create an `.env` file in the root of the repository and add the following keys:

    ```text
    PORT=<Your port number>
    APP_NAME=<Your application name>
    GOOGLE_CLIENT_ID=<From Firebase>
    SESSION_SECRET=<A made up secret>
    FIREBASE_APIKEY=<From Firebase>
    FIREBASE_AUTHDOMAIN=<From Firebase>
    FIREBASE_PROJECTID=<From Firebase>
    FIREBASE_STORAGEBUCKET=<From Firebase>
    FIREBASE_MESSAGINGSENDERID=<From Firebase>
    FIREBASE_APPID=<From Firebase>
    ```

1. Start the application in development mode `npm run dev`
