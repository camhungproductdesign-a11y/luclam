# syntax=docker/dockerfile:1

# Debian slim rather than Alpine, because of sharp.
#
# sharp ships prebuilt binaries per platform and libc. The musl builds exist,
# but on Alpine a mismatch shows up as a build that dies partway through the 360
# image derivatives rather than as an install error, which is a bad way to spend
# an afternoon. glibc is the path sharp is tested hardest on.
FROM node:22-slim

WORKDIR /app

# Dependencies in their own layer, so a change to a page does not reinstall
# sharp and its binaries.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# devDependencies stay in the image on purpose.
#
# The prerenderer bakes public/config.json into the sixty static pages at build
# time, and Creator Studio writes that file at runtime. So an edit only reaches
# the pages a crawler reads when the build runs again — and it has to run here,
# with the live volumes mounted, not at image build time with whatever the repo
# happened to hold:
#
#   docker compose exec app npm run build
#
# Dropping vite and tsx to slim the image would take that away and leave the
# static pages permanently stale.
RUN npm run build

# 0.0.0.0 inside the container, which is the opposite of the default.
#
# The server binds 127.0.0.1 by default, deliberately: on a VPS that keeps the
# write API off the network so nothing can reach POST /api/config around nginx
# and around TLS. Inside a container, loopback means the container's own
# loopback, so nothing outside it — including nginx on the host — could connect
# at all.
#
# The container boundary does the job the bind was doing, as long as the port is
# published to the host's loopback only. compose.yaml does that with
# "127.0.0.1:3000:3000"; publishing it as "3000:3000" would put the API back on
# the public internet.
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

# Answers with JSON, so a 200 carrying an HTML error page does not read as
# healthy — which is exactly how a misconfigured proxy fools a health check.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/api/health').then(r=>r.json()).then(j=>process.exit(j.status==='ok'?0:1)).catch(()=>process.exit(1))"

CMD ["node", "dist/server.cjs"]
