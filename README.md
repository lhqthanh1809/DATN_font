# Student Motel Management Mobile App (React Native)

## Introduction 📱
A graduation thesis project mobile application built with React Native.
## Features ✨
- Cross-platform compatibility (iOS & Android)
- User authentication system
- Eoom/service/device management.
- Invoice handling, contract management, tenant feedback, and statistics, etc.
- Push notifications
- Offline capabilities

## Prerequisites
- Node.js (v14+ recommended)
- npm or yarn
- React Native development environment setup
  - Android Studio (for Android)
  - Xcode (for iOS)

## Installation 🛠️
```bash
# Clone the repository
git clone https://github.com/lhqthanh1809/DATN_font.git
cd DATN_font

# Install dependencies
npm install
# or
yarn install

# For iOS (macOS only)
cd ios && pod install
```

## Running the App 🚀
### Android
```bash
npx react-native run-android
```

### iOS (macOS only)
```bash
npx react-native run-ios
```

## Configuration ⚙️
Create a `.env` file in root directory with required environment variables:
```
AES_IV=your_iv_here,
AES_KEY=your_key_here,
API_URL=your_api_url_here,
KEY_TOKEN=your_key_token_here,
APP_NOTI_ID=your_id_here,
APP_NOTI_TOKEN=your_token_here
```

## Project Structure 📂
```
DATN_font/
├── android/          # Android native code
├── ios/              # iOS native code
├── src/
│   ├── assets/       # App assets
│   ├── ui/           # App UI
│   ├── app/          # App screens
│   ├── services/     # API/services
│   └── utils/        # Utility functions
└── ...               # Other config files
```

## Build Instructions 📦
### Android APK
```bash
cd android && ./gradlew assembleRelease
```

### iOS Archive
Open `ios/YourAppName.xcworkspace` in Xcode and Archive

## Contributing 🤝
Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

## License 📄
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
