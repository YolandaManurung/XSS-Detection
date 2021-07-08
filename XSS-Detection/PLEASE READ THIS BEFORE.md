## HOW/WHAT TO INSTALL
Buka command prompt (cmd) di dalam folder proyek "XSS-Detection" dan jalankan perintah dibawah ini:

### Install package.json
```npm init -y```

### Install package-lock.json
```npm i lite-server```

### Module to install:
```
npm i brfs
npm i browserify
npm i c4.5
npm i papaparse
npm i sweetalert2
npm i scraperapi-sdk
```

## HOW TO RUN
```browserify Features.js -o dist/features.js -t brfs```

## HOW TO USE
- Buka menu "Manage Extensions" pada browser Chrome
- Tekan tombol "Developer mode" pada kanan atas layar
- Tekan tombol "Load unpacked" pada kiri atas layar, kemudian pilih folder proyek
- Akses situs web yang ingin diuji