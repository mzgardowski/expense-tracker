#Dockerfile dla frontendu

# Etap 1: budowanie aplikacji
FROM node:22-alpine AS builder

# Krok 1: ustawienie katalogu roboczego
WORKDIR /app

# Krok 2: kopiowanie plików z zależnościami i ich instalacja
COPY package*.json ./
RUN npm ci

# Krok 3: kopiowanie reszty kodu źródłowego
COPY . .

# Krok 4: budowanie aplikacji
RUN npm run build

# Etap 2: serwowanie przez Nginx
#Wykorzystujemy obraz bazowy serwera Nginx na dystrybucji Alpine Linux
FROM nginx:alpine

#Kopiujemy zbudowaną aplikację do katalogu serwowanego przez Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

#Informacja dla Dockera, że kontener nasłuchuje na porcie 80
EXPOSE 80

#Uruchomienie serwera Nginx w trybie pierwszoplanowym
CMD ["nginx", "-g", "daemon off;"]