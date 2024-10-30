ARG NODE_VERSION=23-alpine3.19

FROM node:${NODE_VERSION}

LABEL name="invoice-generator"
LABEL licence="MIT"
LABEL description="invoice generator image"

ENV NODE_ENV=development

# set the working directory
ARG APP_HOME=/app
WORKDIR ${APP_HOME}

# run docker as a non root user
RUN addgroup --system invoice \
    && adduser --system -G invoice invoice

# install app dependencies
COPY package*.json ./

RUN npm install 

# run the copy command to change ownership of the user within the group `invoice invoice` to the working directory
COPY --chown=invoice:invoice . ${APP_HOME}

RUN chown invoice:invoice ${APP_HOME}

# switch to the newly created user
USER invoice

# Command to run the application for the development server
CMD [ "npm","run","dev" ]