FROM node:20-slim AS web
WORKDIR /web
ARG VITE_CARTO_MAP_KEY
ENV VITE_CARTO_MAP_KEY=${VITE_CARTO_MAP_KEY}
COPY package.json ./
RUN npm install
COPY *.tsx *.ts *.css index.html tsconfig.json vite.config.ts ./
COPY public ./public
RUN npm run build

FROM python:3.12-slim
WORKDIR /srv
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY *.py schema.sql ./app/
COPY --from=web /web/dist /srv/static
EXPOSE 10000
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
