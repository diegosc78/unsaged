FROM node:19-alpine
ARG PNPM_VER=8.10.2
ARG AUTHOR_ATTRIBUTION
RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.shrc" SHELL="$(which sh)" PNPM_VERSION=$PNPM_VER sh - 
ENV PNPM_HOME="/root/.local/share/pnpm" \
    PATH="/root/.local/share/pnpm:$PATH"
WORKDIR /app
COPY . .
# Warning. "PUBLIC" env entries in .env.local will be hardcoded into build output
COPY ./apps/unsaged/.env.local ./apps/unsaged/.env.local
# Hide author attribution?
RUN if [[ -z "$AUTHOR_ATTRIBUTION" ]] ; then echo "a.linkAttribution {display: none;}" >> ./apps/unsaged/styles/globals.css ; fi
RUN pnpm install
RUN pnpm run build
WORKDIR /app/apps/unsaged
RUN pnpm install
RUN pnpm run build
RUN rm .env.local

# Expose the port the app will run on
EXPOSE 3000

# Start the application
WORKDIR /app/apps/unsaged
CMD ["npm", "start"]
