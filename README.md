# auth-service

Auth-service is a microservice that plays the authentication role. The service includes a basic authentication scheme in which users can register, sign in, recover account(password-reset) via any application that uses the service. For now, you are required to register via [Gatepass](https://github/Elikdev/Gatepass) for easy usage of the service.

For quick navigation:

- [auth-service](#auth-service)
  - [Getting Started](#getting-started)
    - [Requirements](#requirements)
    - [Setup Local Environment](#setup-local-environment)
  - [Testing your Code](#testing-your-code)
  - [Contributing Your Code](#contributing-your-code)
    - [Endpoint Documentation](#endpoint-documentation)
    - [Before Submitting Pull Request](#before-submitting-pull-request)
  - [Authors](#authors)
  - [License](#license)

## Getting Started

Ensure that your local machine has all the required software, listed below, before you set up your local environment

### Requirements

- [Node](https://nodejs.org/en/download/)
- [MongoDB](https://www.mongodb.com/)

### Setup Local Environment

You will first need to setup your local environment and ensure that all configuration files are correctly configured.

1. Fork the repo.
2. Clone your forked repo to you local environment.
3. In your terminal, run `npm install`.
4. In your terminal, run `cp .env.example .env`.
5. In your terminal, run `npm run devStart`.

## Testing your Code

1. Run `npm run test` to ensure your code passes all tests

## Contributing Your Code

Are you willing to contribute to this project? You can contribute in many areas but primarily in the following areas

1. Implementing endpoints and controllers
2. Writing unit tests for endpoints and controllers.
3. Documentation
4. Creating middleware and their consumables
5. Fixing/pointing out bugs
6. We could use a boost in our code coverage, so any tests to cover untested fucntions is highly welcome

### Endpoint Documentation

All responses must follow the format specified in the online [documentation](https://auth-service.herokuapp.com). This should be your first go to as this will be the live server with the most trustworthy documentation.

### Before Submitting Pull Request

- Make use of the PR template and edit the placeholders with relevant information. PR descriptions must reference the issue number being fixed, e.g `fix #12` or `resolve #25`.

- Before pushing your commits, ensure your local/forked repo is synced with the latest updates from the original repo to avoid merge conflicts. You can safely do this with a fast-forwards merge.

```bash
git remote add upstream https://github.com/neymarjimoh/auth-service.git
git fetch upstream
git merge upstream/master
git commit
git push origin <branch-name>
```

## Authors

- Jimoh Rildwan Adekunle - jemohkunle2007@gmail.com
- Odutoye Kolade Elijah - koladeodutoye9913@gmail.com

## License

Distributed under the GNU GENERAL PUBLIC LICENSE. See [LICENSE](LICENSE) for more information.

Copyright (c) 2020, Auth-Service. All rights reserved.