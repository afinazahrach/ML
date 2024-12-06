# Gunakan image Node.js sebagai base
FROM node:18

# Tetapkan direktori kerja
WORKDIR /app

# Salin file package.json dan package-lock.json ke container
COPY package*.json ./

# Instal dependencies
RUN npm install

# Salin semua file ke container
COPY . .

# Tetapkan perintah untuk menjalankan aplikasi
CMD ["npm", "start"]

# Ekspos port aplikasi
EXPOSE 8080
