# Gunakan image Node.js versi 18 atau sesuaikan dengan versimu (misal: 16 atau 20)
FROM node:18-alpine

# Set direktori kerja di dalam container
WORKDIR /app

# Copy file package.json dan package-lock.json (jika ada)
COPY package*.json ./

# Install semua dependencies
RUN npm install

# Copy seluruh kode backend ke dalam container
COPY . .

# Ekspos port yang akan digunakan Hapi.js (default Back4App biasanya 8080)
EXPOSE 8080

# Jalankan perintah start dari package.json
CMD ["npm", "start"]