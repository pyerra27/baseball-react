# Baseball React

## Basic Info

The project is built using Python 3 and React 18.2.0.

The Python libraries being used are: FastAPI, PyBaseball, Uvicorn and Pandas.
The React libraries included are Axios, React-Bootstrap, React-CSV and React-Router.

## Installation Info to Use Locally

### Python

#### Python Installation
If you don't have Python on your computer, go to https://www.python.org/downloads/ and download the latest version of Python 3

Once python is installed, run this command in your command prompt to install all of the needed libraries: pip install -r requirements.txt. Make sure that your command prompt is in the folder where the project files are stored.

#### Launching FastAPI
After installing Python libraries, run the following commands in the command prompt to launch the FastAPI app. Once again, you must be in the root project folder.

cd python_api
uvicorn baseball_api:app --reload

To test the api, go to this url in your browser: http://127.0.0.1:8000/api/v1/franchises. If it launched properly, you should see a list of MLB franchises.

### React

#### Installing Node.js
If you don't have Node.js on your computer, go to: https://nodejs.org/en/ and download the recommended version.

#### Installing React and Libraries
The first time you try and run the project you must run this command to install all of the needed libraries: npm i. Make sure that your command prompt is in the folder where the project files are stored.

#### Starting React Project
To launch the React project, make sure the FastAPI app is running (see above for instructions) and in another command prompt run this command: npm start.

## Current Available Features

View basic batting and pitching data for a team in a given year
View basic batting and pitching data for a player over their career
Export a table to a CSV

## Plannned Features
Create graphs from data tables
