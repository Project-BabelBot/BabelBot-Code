# BabelBot

This is the source code for BabelBot, a multilingual kiosk-style web application developed by team BabelTech as part of the ENEL500A course at the University of Calgary. Babelbot is designed to help overcome language barriers at airports by providing an assistant that can recognize which language users speak and respond in that language. A friendly avatar is also used to give a welcoming experience. The client side is a web app using React, and the server side is a REST API using Django Rest Framework. Currently, Babelbot can answer questions about airports in English, Spanish, and French.

# Table of Contents

- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Frontend Installation](#frontend-installation)
  - [Backend Installation](#backend-installation)
- [Development](#development)
- [Contributing](#contributing)
- [Acknowledgements](#acknowledgements)

# Installation

## Prerequisites

This project requires `Python` (v3.10), `Node.js` (v18.12), and `npm` to be installed on your machine. To get started, create a new directory for the project and navigate into it. Then, clone the repository by running:

```
git clone https://github.com/Project-BabelBot/BabelBot-Code.git
```

### Frontend Installation

For frontend installation, navigate to the `frontend` folder from the root directory:

```
cd frontend
```

Then, install the required dependancies:

```
npm install
```

### Backend Installation

For backend installation, navigate to the `backend` folder from the root directory:

```
cd backend
```

If you want, create a new virtual environment either using `venv` or `anaconda` on your machine to manage your dependancies. Then, install the required backend dependancies:

```
pip install -r requirements.txt
```

# Development

1. Navigate into the `backend` folder from the root directory:

```
cd backend
```

2. Start the Django server:

```
python manage.py runserver
```

3. On a different terminal, navigate into the `frontend` folder from the root directory:

```
cd frontend
```

4. Start the React development server:

```
npm start
```

# Contributing

As an open source project, contributions are appreciated! If you'd like to contribute, please follow these steps:

1. Make an issue describing your requests and label it appropriately (tag it with "bug", "enhancement", etc)

2. Fork the Project

3. Create your feature branch and name it "T[ISSUE NUMBER]-Your-Branch-Name" (eg. `git checkout -b T70-Amazing-Feature`)

4. Commit your changes (eg. `git commit -m "Added MyAmazingFeature"`)

5. Open a pull request with the title "T[ISSUE NUMBER]: [Feature Name] (eg. T70: Amazing Feature). Please add a description and tag the pull request appropriately as well!

# Acknowledgements

We'd like to thank Dr. Svetlana Yanushkevich, the University of Calgary Biometric Technologies Laboratory, and the Schulich School of Engineering for making this project possible. We'd also like to thank Tariq Al Shoura and Dr. Geoffrey Messier for their support and guidance.
