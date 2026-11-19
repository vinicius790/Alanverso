# syntax=docker/dockerfile:1
FROM nginx:1.27-alpine

LABEL description="Alanverso v5.0.0 — Portal Interativo Web Puro servido com Nginx Alpine" \
      version="5.0.0"

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html manifest.json sw.js ./
COPY assets/ ./assets/
COPY src/ ./src/
COPY styles/ ./styles/

RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -q -O /dev/null http://localhost/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
