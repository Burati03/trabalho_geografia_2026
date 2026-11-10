FROM node:20-slim AS web
WORKDIR /web
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
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
