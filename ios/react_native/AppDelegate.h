/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
#import <AppAuth/AppAuth.h>
#import "RNAppAuthAuthorizationFlowManager.h"
#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>

//@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate>
@interface AppDelegate : UIResponder <UIApplicationDelegate, RNAppAuthAuthorizationFlowManager>

@property(nonatomic, weak)id<RNAppAuthAuthorizationFlowManagerDelegate>authorizationFlowManagerDelegate;

@property (nonatomic, strong) UIWindow *window;


@end
