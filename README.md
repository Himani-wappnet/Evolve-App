# Evolve_App

A React Native project.

## Table of Contents

- [Introduction](#introduction)
- [Configuration (Environment Configurations)](#environment-configurations)
- [Running the Project](#running-the-project)
- [Building the Project](#building-the-project)
- [Additional Information](#additional-information)

## Introduction

`Evolve_App` is more than just a productivity app — it’s your daily partner in building a balanced, healthier lifestyle. Whether you're aiming to reduce screen time, improve your diet, establish better habits, or wake up with purpose, Evolve helps you take small, consistent steps toward a better you.

## Running the Project

To run the desired ENVIRONMENT either use the launch configuration in VSCode or use the following commands:

### 1 DEVELOPMENT

```sh
npx react-native start
npx react-native run-android
```

## Building the Project

To build appbundle the desired ENVIRONMENT use the the following commands:

### 1 DEVELOPMENT

```sh
cd android && ./gradlew bundleRelease && cd ..
```

To build apk the desired ENVIRONMENT use the the following commands:

### 1 DEVELOPMENT

```sh
cd android && ./gradlew app:assembleRelease && cd ..
```

## 🛠️ Platform Requirements

This project requires the following versions:

- React Native: 0.77.0
- React: 18.3.1
- Node.js: >=18.x.x
- npm: >=9.x.x or yarn >=1.22.x
- Java: JDK 11 or JDK 17
- versionCode 1
- versionName "1.0"

## Additional Information

### Projects Folder Structure

```
ikonik_dance_app/
├── android/
├── ios/
├── src/
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── TouchableText.tsx
│   │   └── LoadingBar.tsx
│   ├── screens/
│   │   ├── SplashScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── ProfileScreen.tsx
│   ├── navigation/
│   │   ├── AuthStack.tsx
│   │   ├── HomeStack.tsx
│   │   ├── RootNavigator.tsx
│   ├── assets/
│   │   ├── images/
│   │   │   └── login.jpg
│   │   │   └── homepage.jpg
│   │   ├── icons/
│   │   │   ├── apple_logo.png
│   │   │   └── about_us.png
│   │   │   └── arrow.png
│   ├── constant/
│   │   ├── Dimens.tsx
│   │   ├── ImageConst.ts
│   │   ├── String.ts
│   │   ├── Links.ts
|   ├── utils/
|   |   ├── Validation.ts
|   |   ├── Endpoints.ts
|   |   ├── AxiosInstance.ts
|   |   ├── normalize.ts
|   ├── styles/
|   |   ├── Colors.ts
|   |   ├── Text.ts
│   ├── App.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── .eslintrc.js
│   └── .prettierrc
│   └── babel.config.js
│   └── README.md
```
