FROM oven/bun:1@sha256:3aa040e5445efa09d75bb428a64ba50db13e2b3ac9b6b0c7f145615f62b2ee18 AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM deps AS builder
ARG SITE_URL=https://luisjcenteno.dev
ENV SITE_URL=$SITE_URL
COPY . .
RUN bun run build

FROM nginxinc/nginx-unprivileged:alpine@sha256:b5047b9b76845eac124358373c6852377c52e4b05834a47647e955dd91cb8f1e AS runner
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/dist .
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
