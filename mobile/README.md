# Smart Shop Mobile

Flutter mobile app for Smart Shop / New Steel. The app connects only to the existing Node.js backend API and never connects directly to Neon PostgreSQL.

## Backend

```powershell
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run seed
npm run dev
```

The backend API runs at `http://localhost:5000/api`.

## Flutter

```powershell
cd mobile/smart_shop_mobile
flutter pub get
flutter doctor
flutter devices
flutter run --dart-define=API_BASE_URL=http://YOUR_COMPUTER_IP:5000/api
```

For the Android emulator, use:

```powershell
flutter run --dart-define=API_BASE_URL=http://10.0.2.2:5000/api
```

For a real Android phone on the same Wi-Fi, replace `YOUR_COMPUTER_IP` with your Windows IPv4 address:

```powershell
ipconfig
flutter run --dart-define=API_BASE_URL=http://192.168.18.42:5000/api
```

If the APK is already installed and login says it cannot connect, tap **Server** on the login screen and set:

```text
http://192.168.18.42:5000/api
```

Then try login again.

## Demo Accounts

- `admin` / `Admin@123`
- `manager` / `Manager@123`
- `salesman` / `Salesman@123`
- `accountant` / `Accountant@123`
- `customer1` / `Customer@123`

## Troubleshooting

- If the phone cannot connect, confirm the computer and phone are on the same Wi-Fi.
- Use `ipconfig` on Windows to find the computer IPv4 address.
- Allow port `5000` through Windows Firewall.
- Restart the backend after CORS changes.
- For emulator use `10.0.2.2`.
- For a real phone use the computer IP address.
- Never use `localhost` on a real phone because `localhost` means the phone itself.
- Local HTTP is enabled in Android for development with `android:usesCleartextTraffic="true"`. Use HTTPS for production.
