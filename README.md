# OIDC/OAuth 2.0 React Native Sample Guide
This sample demonstrate how applications, installed on devices like phones, tablets, and computers, can trigger PingOne for Customers(P14C) OAuth 2.0 endpoints to authenticate and authorize access to P14C APIs. 

OAuth 2.0 allows users to share specific data with an application while keeping their usernames, passwords, and other information private.
Native apps are distributed to individual devices, are classified as public clients and **cannot keep secrets**.
The authorization flow for such applications is similar to the one used for web server applications, with a small difference - those **apps must open the system browser and supply a local redirect URI to handle responses from the PingOne authorization server**
For more information please check [OAuth 2.0 for Native Apps specification](https://tools.ietf.org/html/rfc8252)

# Content
1. [Prerequisites](#prerequisites)
1. [Setup](#setup)
    1. [iOS Setup](#ios-setup)
    1. [Android Setup](#android-setup)
    1. [More Details](#more-details)
1. [Developer Notes](#developer-notes)
1. [Issues](#issues)


# Prerequisites 
1. If you don't have a React Native app, or are new to React Native, please start with [React Native's](https://facebook.github.io/react-native/docs/getting-started) documentation. It will walk you through the creation of a React Native app and other application development essentials.
If you are developing with an Android device emulator, make sure to check out the React Native - Android Development setup instructions.
1. Create native application to authorize against with `REDIRECT URL` as `com.example.app:/redirect_uri_path`


# Setup

To demonstrate OAuth2/OIDC implementation we have used React Native bridge for [AppAuth](https://appauth.io/) - the [React Native App Auth SDK](https://github.com/FormidableLabs/react-native-app-auth)

1. [Link](https://facebook.github.io/react-native/docs/linking-libraries-ios) the native parts of react native [bridge for AppAuth](https://github.com/FormidableLabs/react-native-app-auth) library for the platforms we are using :
    ```bash 
    react-native link react-native-app-auth
    ``` 
    
1. Adjust [config.js](config.js) with your application configuration data, where
- `ENVIRONMENT_ID`: *Required*. Your application's Environment ID. 

    You can find this value at your Application's Settings under 
    **Configuration** tab from the admin console( extract `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` string that specifies the environment 128-bit universally unique identifier ([UUID](https://tools.ietf.org/html/rfc4122)) right from `https://auth.pingone
    .com/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/as/authorize` *AUTHORIZATION URL* ). Or from the *Settings* main menu (*ENVIRONMENT ID* variable)
- `client_id`: *Required*. Your application's UUID. You can also find this value at Application's Settings right under the Application name.
- `clientSecret`: *Required*. Your application's secret.
- `redirectUrl`: *Required*. Determines how PingOne's authorization server sends a response to your app. Is equal to a custom URL scheme `com.example.app:/redirect_uri_path`
- `scopes`: *Required*.  String identifiers understood by both the authorization server and the resource server to represent the specific boundaries of access (i.e `email, address, profile, phone`).
- `additionalParameters- > max_age`: *Optional*. A string that specifies the maximum amount of time allowed since the user last authenticated. If the max_age value is exceeded, the user must re-authenticate.
- `additionalParameters- > prompt`: *Optional*.  A string that specifies whether the user is prompted to login for re-authentication. The prompt parameter can be used as a way to check for existing authentication, verifying that the user is still present for the current session. 
  - For `prompt=none`, the user is never prompted to login to re-authenticate, which can result in an error if authentication is required. 
  - For `prompt=login`, if time since last login is greater than the max-age, then the current session is stashed away in the flow state and treated in the flow as if there was no previous existing session. 
  
  When the flow completes, if the flow’s user is the same as the user from the stashed away session, the stashed away session is updated with the new flow data and persisted (preserving the existing session ID). 
  If the flow’s user is not the same as the user from the stashed away session, the stashed away session is deleted (logout) and the new session is persisted. 


**TIPS**: 
- If you see a **_"Command link unrecognized"_** error, run `npm install && react-native link`.
- If you see a **_"react-native: command not found"_** error, run `export PATH="/usr/local/Cellar/node/<your version>/bin:$PATH"`. 

## iOS Setup
1. Since [React Native App Auth](https://github.com/FormidableLabs/react-native-app-auth) depends on [AppAuth-iOS](https://github.com/openid/AppAuth-iOS), you need to configure it as a dependency.
 The easiest way to do that is to use CocoaPods (that manages library dependencies for this project). To install CocoaPods, run the following command:
`sudo gem install cocoapods`. The dependencies are specified in a single text file called a [Podfile](./ios/Podfile).
1. Run `pod install` from the `ios` directory.
1. Run `react-native run-ios` inside your React Native project folder


## Android Setup

All native dependencies for Android are automatically installed by Gradle, so nothing else is necessary to do.

**TIPS**: 
- If you see a **_"spawnSync ./gradlew EACCES error when running react native project on "_** error, run `chmod 755 android/gradlew `.

## More Details

**Redirect URL scheme registration** 

We are using a **custom scheme based redirect URI** such as `com.example.app://` for Android and iOS application versions. 

**iOS specifics:** 
For iOS, the custom scheme `com.example.app` is specified in the app’s [Info.plist](./ios/react_native/Info.plist) file. This causes the device to launch this application any time a URL that begins with this custom scheme is visited, including from mobile Safari or from within other iOS apps.

When the user taps the “Sign In” button, the app opens PingOne login URL in a [SFSafariViewController](https://developer.apple.com/documentation/safariservices/sfsafariviewcontroller) to open an embedded browser that shares system cookies. 
Using an embedded WebView window within the app is considered extremely dangerous, as this provides the user no guarantee they are looking at the service’s own website, and is an easy source of a phishing attack. 
By using the SFSafariViewController API, which shares the Safari cookies, you have the advantage of the user potentially already being signed in to the service as well.

When the user finishes signing in, the service will redirect back to your app’s redirect URL, which in our case, has a custom scheme that will trigger the `application:openURL:options:` method in our app delegate. The Location header from the redirect will look something like the following, which will be passed in as the url parameter to your method.
`com.example.app://auth://auth?state=1234zyx&code=lS0KgilpRsT07qT_iMOg9bBSaWqODC1g061nSLsa8gV2GYtyynB6A`

Our app then parses out the authorization code from the URL, exchange the code for an access token, and dismiss the SFSafariViewController. 

**Android specifics:** 
When a custom scheme is used, application captures all redirects using this custom scheme through a manifest placeholder, located under [build.gradle](android/app/build.gradle): 
```groovy
android {
  defaultConfig {
    manifestPlaceholders = [
      appAuthRedirectScheme: 'com.example.app'
    ]
  }
}
```

# Developer Notes
1. Always open a native browser or use SFSafariViewController. You should never open an embedded web view with the OAuth prompt, since it provides no way for the user to verify the origin of the web page they’re looking at.
1. Clearing the Cache of your React Native Project: `watchman watch-del-all && rm -rf $TMPDIR/react-* && rm -rf node_modules/ && npm cache verify && npm install && npm start -- --reset-cache`
1. The rule of thumb **if you're using pods, you have to open `.xcworkspace`**.
1. AppAuth version `0.95.0` was used because of this [issue](https://github.com/FormidableLabs/react-native-app-auth/issues/256)
1. If encountering a bunch of mysterious errors while  trying to get react-native working with XCode 10, try to change the build setting to legacy.
		1. First, open your project in XCode by double-clicking on ios/<YourApp.xcworkspace>.
		1. Then go to File > Project Settings …
		1. Change the Build System to Legacy Build System in Per-User Project Settings.
1. If you have installed simulators for different iOS versions and you want to run the app in an specific one use : `react-native run-ios --simulator "iPhone 6s (9.3)"`

# Issues
1. Add support [PKCE](https://tools.ietf.org/html/rfc7636) (Proof Key for Code Exchange) and remove `clientSecret` parameter usage, since static client secrets can be easily extracted from apps and allow others to impersonate the app and steal user data. 
