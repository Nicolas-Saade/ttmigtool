⚠️⚠️ Instructions for upcoming developers:

Download Android Studio and XCode.

# General Setup #
In the Back End Dir Run:
  - run python3 manage.py runserver (Remember to run this command to turn on back end when testing App)
In the Front End Dir Run:
  - install Node ( I have v22.12.0 )
  - install npm ( I have v10.9.0 )
  - install watchman

For iOS:
  - cd ios && pod install

For Android:
  - Gradle Handles dependencies so nothing to do

How to run the app (after having turned on the Back End):
In the Front End folder:
  - Run npx react-native start --reset-cache
  - For android, run: npx react-native run-android
  - For ios, run: npx react-ntaive run-ios

I HIGHLY doubt that this process will be smooth for anyone, so if you end up encountering errors don't worry it is completely normal, try to debug them (and get a taste of what I was going through :)), if nothing works lmk and I ll come and help
