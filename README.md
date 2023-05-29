# Spring WebSocket Authentication

Implementation of WebSocket connection with OAuth 2.0 authentication.

## The Problem

[RFC 6455][rfc-6455], which describes the WebSocket protocol, does not provide much information about authentication. It only mentions that it can use any client authentication mechanism like cookies, HTTP or TLS authentication. There is no major information about how to actually implement it and specifically, using the OAuth 2.0 authorization framework. To make things worse, browser's WebSocket implementation does not allow informing HTTP headers along WebSocket connections, so it is not possible to use send OAuth 2.0 access tokens through them. It is necessary then to figure out how to implement such authentication protocol with the alternatives available for communication protocol.

## The Solution

According to [RFC 6750][rfc-6750], which describes the OAuth 2.0 authorization framework bearer token usage, one of the possibilities of passing the access token is through [URI query parameter][rfc-6750-section-2.3]. Since WebSocket protocol allows to pass query parameters along its URL, this is the best alternative to use the authentication framework along with the communication protocol.

This project is an example of how to implement the OAuth 2.0 authentication framework on WebSocket protocol by taking advantage of URI query parameter to pass its access token.

## Project Execution

If you simply want to check the final result, this project contains a Docker Compose file which will build, configure and execute all the necessary services.

### Requirements

- [Docker][docker] (tested using version 23.0.6)
- [Docker Compose plugin][docker-compose] (tested using version 2.17.3)

### Steps

1. Run `docker compose up -d` under the project root directory to set all required service containers.
1. Access the address [`http://localhost:3000`][project-page] through a web browser. The project page will be presented.
![image](https://github.com/MarceloLeite2604/spring-websocket-authentication/assets/13152452/3f0986b2-6ae0-4158-9c03-f869f5cca829)

1. Click on "Log in" button to access the Keycloak realm authentication page.
![image](https://github.com/MarceloLeite2604/spring-websocket-authentication/assets/13152452/69183ea1-b6d7-4f35-8323-35900677d6e1)
The realm contains two users: `authorized-user` and `unauthorized-user`. Both accounts can be used to authenticate with the WebSocket service, but only the former is authorized to consume such service. If you attempt to connect on WebSocket with `unauthorized-user` credentials, the service will close the connection.</br>
**Obs:** The password for both accounts is `123456`.

1. Click on "Connect" button to connect to the service through WebSocket.
![image](https://github.com/MarceloLeite2604/spring-websocket-authentication/assets/13152452/206139e7-8875-4c4d-b685-ae1c7989e651)

1. Depending of which credentials were used (if any) the service will respond in three different ways

- If `authorized-user` credentials were used, the service will accept the WebSocket connection.
- If `unauthorized-user` credentials were used, the service will not accept the connection and the page will display a "Not authorized" message.
- If no credentials were provided, then the service will not accept the connection and the page will display a "Not authenticated" message.

# Modifying And Executing The Project
If you want to check/modify the code and execute it, the project also provides the required infrastructure for it.

## Infrastructure Services

This project uses [Keyloak][keycloak] as credentials manager and OAuth 2.0 authentication provider service. It uses a [PostgreSQL][postgresql] database to store all its information. Both services can be created using [Docker Compose][docker-compose].

To start both services, just type `docker compose --profile infrastructure up -d` on the project root directory. Keycloak service will be available at [`http://localhost:8081`](http://localhost:8081) address. The admin username and password are `admin`, and the realm used for this project is "swa".

## Backend Service

### Requirements

- Java Development Kit (JDK): Minimal required version is 20. I recommend using [Eclipse Temurin][eclipse-temurin].
- [Maven][maven] (tested on version 3.6.3)

### Execution

The most straightforward way to start the backend project is using the [Maven Spring Boot Plugin][maven-spring-boot-plugin]. Just run `mvn spring-boot:run` command under the `backend` project directory.

Alternatively, you can load the project in an IDE (e. G. [IntelliJ][intellij] or [Eclipse][eclipse]) and execute it through its main method located at [`SwaApplication`][swa-application] class.

## Frontend Pages

### Requirements

- [Node][node] (tested on version 18.14.2)
- [Yarn][yarn] (tested on version 1.22.19)

### Execution

Under the `frontend` directory, run `yarn install && yarn start` to download all dependencies and start the project in development mode. THe pages will be available at [`http://localhost:3000`][project-page]

If you want to check or modify the code you can load the project under `frontend` directory using an IDE (e. G. [Visual Studio Code][vscode]).

## Donation

If you liked the project and *really* want to demonstrate your appreciation, you can send me a "thank you" coffee. 🙂

[![Yellow PayPal Donation button with "donate" text written on it](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)][paypal-donation]

[docker]: https://docs.docker.com/engine/
[docker-compose]: https://docs.docker.com/compose/install/
[eclipse]: https://www.eclipse.org/downloads/
[eclipse-temurin]: https://adoptium.net/temurin/releases/
[intellij]: https://www.jetbrains.com/idea/
[keycloak]: https://www.keycloak.org/
[maven]: https://maven.apache.org/
[maven-spring-boot-plugin]: https://docs.spring.io/spring-boot/docs/current/maven-plugin/reference/htmlsingle/
[node]: https://nodejs.org/en/download
[paypal-donation]: https://www.paypal.com/donate/?hosted_button_id=C6LPXWCHGRUVQ
[postgresql]: https://www.postgresql.org/
[project-page]: http://localhost:3000
[rfc-6455]: https://datatracker.ietf.org/doc/html/rfc6455
[rfc-6750]: https://datatracker.ietf.org/doc/html/rfc6750
[rfc-6750-section-2.3]: https://datatracker.ietf.org/doc/html/rfc6750#section-2.3
[swa-application]: ./backend/src/main/java/com/github/marceloleite2604/swa/SwaApplication.java
[vscode]: https://code.visualstudio.com/download
[yarn]: https://yarnpkg.com/