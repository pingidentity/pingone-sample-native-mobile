# OIDC Authentication React Native Sample Guide

# Prerequisites 
1. If you don't have a React Native app, or are new to React Native, please start with [React Native's](https://facebook.github.io/react-native/docs/getting-started) documentation. It will walk you through the creation of a React Native app and other application development essentials.
If you are developing with an Android device emulator, make sure to check out the React Native - Android Development setup instructions.
1. Create native application to authorize against. If you are running this locally and using the defaults from React Native's documentation, your port will be 19000

For more information please check [OAuth 2.0 for Native Apps specification](https://tools.ietf.org/html/rfc8252)

## iOS Setup
1. React Native App Auth depends on AppAuth-ios, so you have to configure it as a dependency. The easiest way to do that is to use CocoaPods. To install CocoaPods, run the following command:
`sudo gem install cocoapods`
CocoaPods manages library dependencies for this projects. The dependencies are specified in a single text file called a Podfile.
1. Run `pod install` from the ios directory
1. [Install and link](https://facebook.github.io/react-native/docs/linking-libraries-ios) React native bridge for AppAuth - an SDK for communicating with OAuth2 providers:
```bash
npm i react-native-app-auth@4.3.1 --save
react-native link
```

**TIP**: If you see a "Command link unrecognized" error, run `npm i && react-native link`.
 
1. Run `npm i styled-components --save`
1. Run react-native run-ios inside your React Native project folder:
   
   cd AwesomeProject
   react-native run-ios

**TIP**: If you see a "react-native: command not found" error, run `export PATH="/usr/local/Cellar/node/<your version>/bin:$PATH"`. 

## Details

1. For the redirect URL of the native app, on iOS, apps can register a **custom URL** scheme such as `org.example.app://` so the application is launched whenever a URL with that scheme is visited. 
On iOS, you should register the custom scheme you will be using in the app’s `.plist` file. This will cause the device to launch your app any time a URL that begins with your custom scheme is visited, including from mobile Safari or from within other iOS apps.
On Android, apps can register URL matching patterns which will launch the native app if a URL matching the pattern is visited.


When the user taps the “Sign In” button, the app should open the login URL in a [SFSafariViewController](https://developer.apple.com/documentation/safariservices/sfsafariviewcontroller) to open an embedded browser that shares system cookies. Using an embedded WebView window within the app is considered extremely dangerous, as this provides the user no guarantee they are looking at the service’s own website, and is an easy source of a phishing attack. By using the SFSafariViewController API, which shares the Safari cookies, you have the advantage of the user potentially already being signed in to the service as well.

Upon being directed to the auth server, the user sees an authorization request with The “Done” button in the top right corner collapses the view and returns the user to the app.

When the user finishes signing in, the service will redirect back to your app’s redirect URL, which in this case, has a custom scheme that will trigger the application:openURL:options: method in your app delegate. The Location header from the redirect will look something like the following, which will be passed in as the url parameter to your method.

com.example.app://auth://auth?state=1234zyx
&code=lS0KgilpRsT07qT_iMOg9bBSaWqODC1g061nSLsa8gV2GYtyynB6A

Your app should then parse out the authorization code from the URL, exchange the code for an access token, and dismiss the SFSafariViewController. Exchanging the code for an access token is the same as in the Authorization Code flow, except without using the client secret.

## Implicit flow specifics
To successfully request an ID token, the app registration in the PingOne admin console must have the implicit grant flow enabled correctly, by selecting Access tokens and ID tokens under the Implicit grant section.
It is important that your application uses the access token to grant access, and the ID token - to verify that users are who they say they are ( authentication ).
The ID Token contains the `client_id` in the ID Token's `aud` claim for the client to check the user.
This means, just receiving an `id_token` isn't sufficient to authenticate the user; you must also validate the `id_token`'s signature and verify the claims in the token based on your app's requirements. 
The P14C uses JSON Web Tokens (JWTs) and public key cryptography to sign tokens and verify that they're valid.

# Notes
1. Always open a native browser or use SFSafariViewController. You should never open an embedded web view with the OAuth prompt, since it provides no way for the user to verify the origin of the web page they’re looking at.
1. Clearing the Cache of your React Native Project: `npm start -- --reset-cache`

