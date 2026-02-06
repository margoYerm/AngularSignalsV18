
##  Angular With Signals
This repository is an educational full‑stack project based on Angular 18 (Signals) on the frontend and Node.js + Express + TypeScript on the backend.


## Installation pre-requisites

Node 18 (Long Term Support version) is using in this project.
npm (comes with Node)

Install dependencies from the root folder:

npm install


## Running the local backend server

The backend provides a REST API used by the Angular frontend.

Start the backend server with:

    npm run server

* Server runs with ts-node

* Uses an in‑memory database (db-data.ts)

* API is strongly typed using DTOs


## Running the Frontend Server (Angular)

To run the frontend part of our code, we will use the Angular CLI:

    npm start

or:

    ng serve

The application is visible in port 4200: [http://localhost:4200](http://localhost:4200)


## Authentication (Demo) 
Use the following credentials to log in:

email: 'test@angular-university.io',
password: 'test'


## Running Tests:

From the root folder:

		npm run test:server → Express / services

* Uses Jest + ts-jest

* Tests business logic (services)

* Repository layer is mocked


Client (Angular) tests are not implemented yet. Command to feature:

		npm run test:client → Angular (not implemented)


## Backend Architecture (Business Logic)

The backend follows a clean layered architecture:

Routes → Services → Repositories → In‑memory DB
				↑
				DTOs (API contract)

* Business rules are isolated in services

* Persistence logic is isolated in repositories

* API contracts are isolated using DTOs

* Frontend and backend are fully decoupled


## DTO (Data Transfer Object) Strategy

DTOs define the API contract between frontend and backend.

They are located in:

		server/models/dto/

Benefits
	
* Clear separation between domain models and API models

* Strong type safety

* Explicit request / response shapes

* Easier evolution of the API


## Lessons Business Rules

* Lessons are fetched via a dedicated service

* Output is limited to 10 lessons per request

* Pagination and filtering logic is encapsulated in the service layer


## Courses Business Rules

* Course creation validates business constraints (title length, required fields)

* lessonsCount is initialized at creation time

* Update and delete operations validate course existence

* IDs are generated server‑side


## Unit Testing Strategy

# Tested Components

* LessonService

* CourseService

# Testing Principles

* Jest is used as the test runner

* Repositories are mocked

* Only business logic is tested

* No HTTP / Express dependency in unit tests


This ensures:

* Fast tests

* Deterministic behavior

* Easy CI automation


## Structure of Angular signals
.angular/
.vs/
.vscode/
.node_modules/
server/
	repositories/
		course.repository.ts
		lesson.repository.ts
		user.repository.ts
	services/
		course.service.ts
		course.service.spec.ts
		lesson.service.ts
		lesson.service.spec.ts
		auth.service.ts
	routes/
		course.route.ts
		lesson.route.ts
		auth.route.ts
	models/
		dto/ ← DTO (API contract)
            lessons            
			    get-lessons.response.ts
                create-lesson.request.ts
                update-lesson.request.ts
                lesson.response.ts
            courses
                course.response.ts
                create-course.request.ts
                get-course.response.ts
			    get-courses.response.ts
                update-course.request.ts
			login.request.ts
			login.response.ts
		course.model.ts
		lesson.model.ts
		user.model.ts	
		
	db-data.ts	
	server.ts
	server.tsconfig.json
src/
	app/
		course/
			course-lessons.resolver.ts
			course.component.html
			course.component.scss
			course.component.ts
			course.resolver.ts
		course-category-combobox/
			course-category-combobox.component.html
			course-category-combobox.component.scss
			course-category-combobox.component.ts
		course-card-list/
			courses-card-list.component.ts
			courses-card-list.component.scss
			courses-card-list.component.html
		edit-course-dialog/
			edit-course-dialog.component.html
			edit-course-dialog.component.scss
			edit-course-dialog.component.ts
			edit-course-dialog.data.model.ts
		guards/
			auth.guard.ts
		home/
			home.component.html
			home.component.scss
			home.component.ts
		lessons/
			lesson-detail/
				lesson-detail.component.html
				lesson-detail.component.scss
				lesson-detail.component.ts
			lessons.component.html
			lessons.component.scss
			lessons.component.ts
		loading/
			loading.component.html
			loading.component.scss
			loading.component.ts
			loading.service.ts
			skip-loading.component.ts
		login/
			login.component.html
			login.component.scss
			login.component.ts
		messages/
			messages.component.html
			messages.component.scss
			messages.component.ts
			messages.service.ts
		models/
			course-category.model.ts
			course.model.ts
			get-courses.response.ts
			get-lessons.response.ts
			lesson.model.ts
			message.model.ts
			user.model.ts
		resource-demo/
			resource-demo.component.html
			resource-demo.component.scss
			resource-demo.component.ts
		services/
			auth.service.ts
			courses-fetch.service.ts
			lessons.service.ts
			loading.service.ts
		app.component.html
		app.component.scss
		app.component.ts
		app.config.ts
		app.routes.ts
	assets
		icons/
			close.svg
		environments
			environments.development.ts
			environments.ts
		styles
			_buttons.scss
			_forms.scss
			_table.scss
	favicon.ico
	index.html
	main.ts
	styles.scss
	.editorconfig
	.gitignore
	angular.json
	package-lock.json
	package.json
	jest.config.ts
	tsconfig.json
	tsconfig.spec.json

DTO allows me to decouple API contracts from domain models, ensures type safety, and makes backend–frontend communication explicit and maintainable.


In the lessons service declared a limit for 10 lessons to each output.