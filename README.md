# Repo-History-Visualiser

A project to produce customisable visualsiations of Git repository histories. This project was created as part of a University of York, Computer Science bachelor's degree.

## Running the program

There are several ways to run the program depending on your needs:

### Development mode

Within the directory "front-end" execute the command *`npm start`*
Then within the root folder execute the command `mvnw spring-boot:run`

The Spring Boot server is now being hosted on [http://localhost:8080](http://localhost:8080) so endpoints can be tested to that port.

Open [http://localhost:3000](http://localhost:3000) to view the front-end in your browser.
The page will reload when you make changes.\
You may also see any lint errors in the console.

### Combined development mode

This mode builds the front-end and copies the files across to run with the back-end

Execute the following command in the root directory: 
`./mvnw spring-boot:run -Pprod`

Builds the front-end react app and runs the springboot applciation with this built version of the front-end

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

