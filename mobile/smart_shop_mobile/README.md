# Smart Shop Mobile

Flutter mobile app for Smart Shop / New Steel. The app talks only to the existing Node.js API and never connects directly to Neon PostgreSQL.

## Stack

- Flutter mobile app in `mobile/smart_shop_mobile`
- Existing backend API: `http://localhost:5000/api`
- JWT auth stored with `flutter_secure_storage`
- API calls use `Authorization: Bearer TOKEN`
- Iron Forge theme: dark navy surfaces with orange accents

## Backend

From the project root:

```powershell
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run seed
npm run dev
```

The backend should listen on port `5000`. Restart it after any CORS change.

## Flutter

```powershell
cd mobile/smart_shop_mobile
flutter pub get
flutter doctor
flutter devices
flutter run --dart-define=API_BASE_URL=http://YOUR_COMPUTER_IP:5000/api
```

For Android emulator:

```powershell
flutter run --dart-define=API_BASE_URL=http://10.0.2.2:5000/api
```

For a real Android phone on the same Wi-Fi, find your Windows IPv4 address:

```powershell
ipconfig
```

Then run with your computer IP:

```powershell
flutter run --dart-define=API_BASE_URL=http://192.168.18.42:5000/api
```

Do not use `localhost` on a real phone. On a phone, `localhost` means the phone itself, not your computer.

## Demo Accounts

- `admin` / `Admin@123`
- `manager` / `Manager@123`
- `salesman` / `Salesman@123`
- `accountant` / `Accountant@123`
- `customer1` / `Customer@123`

## Phone Troubleshooting

- Confirm the phone and computer are on the same Wi-Fi.
- Use `ipconfig` on Windows and copy the active adapter IPv4 address.
- Allow port `5000` through Windows Firewall.
- Restart the backend after changing CORS or environment settings.
- Use `10.0.2.2` for Android emulator.
- Use the computer LAN IP for a real phone.
- Keep `android:usesCleartextTraffic="true"` only for local HTTP development.
- Use HTTPS for production backend URLs.

## Verification

```powershell
flutter test
flutter analyze --no-fatal-infos
```
