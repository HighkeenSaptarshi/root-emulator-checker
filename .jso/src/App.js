  var _interopRequireDefault = _$$_REQUIRE(_dependencyMap[0]);
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;
  var _asyncToGenerator2 = _interopRequireDefault(_$$_REQUIRE(_dependencyMap[1]));
  _$$_REQUIRE(_dependencyMap[2]);
  var _react = _interopRequireWildcard(_$$_REQUIRE(_dependencyMap[3]));
  var _native = _$$_REQUIRE(_dependencyMap[4]);
  var _stack = _$$_REQUIRE(_dependencyMap[5]);
  var _drawer = _$$_REQUIRE(_dependencyMap[6]);
  var _reactNative = _$$_REQUIRE(_dependencyMap[7]);
  var _Splash = _interopRequireDefault(_$$_REQUIRE(_dependencyMap[8]));
  var _Intro = _interopRequireDefault(_$$_REQUIRE(_dependencyMap[9]));
  var _Login = _interopRequireDefault(_$$_REQUIRE(_dependencyMap[10]));
  var _LeftMenuBar = _interopRequireDefault(_$$_REQUIRE(_dependencyMap[11]));
  var _jsxRuntime = _$$_REQUIRE(_dependencyMap[12]);
  function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
  function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
  /**
   * Sample React Native App
   * https://github.com/facebook/react-native
   *
   * @format
   */

  // import {fetch} from 'react-native-ssl-pinning';

  var Stack = (0, _stack.createStackNavigator)();
  var Drawer = (0, _drawer.createDrawerNavigator)();
  var App = function App() {
    //SSL Pinning
    // const getDataSSL = () => {
    //   fetch(`${URL}`, {
    //     method: 'GET',
    //     timeoutInterval: 10000, // milliseconds
    //     // your certificates array (needed only in android) ios will pick it automatically
    //     pkPinning: true,
    //     sslPinning: {
    //       certs: [
    // 'sha256/UvVQCYbTtiOChjyEmasVWFI2arIt406Z9tmpPZSjsos=',
    // 'sha256/E3tYcwo9CiqATmKtpMLW5V+pzIq+ZoDmpXSiJlXGmTo=',
    // 'sha256/i7WTqTvh0OioIruIfFR4kMPnBqrS2rdiVPl/s2uC/CY=',
    //       ],
    //     },
    //     headers: {
    //       Accept: 'application/json; charset=utf-8',
    //       'Access-Control-Allow-Origin': '*',
    //       e_platform: 'mobile',
    //     },
    //   })
    //     .then(response => {
    //       console.log(`response received ${response}`);
    //     })
    //     .catch(err => {
    //       console.log(`error: ${err}`);
    //     });
    // };

    // useEffect(() => {
    //   getDataSSL();
    // }, []);

    // useEffect(() => {
    //   initializeSslPinning({
    //     URL: {
    //       includeSubdomains: true,
    //       publicKeyHashes: [hashKey],
    //     },
    //   });
    //   const subscription = addSslPinningErrorListener(error => {
    //     // Triggered when an SSL pinning error occurs due to pin mismatch
    //     console.log('Invalid Request.' + error.message);
    //   });

    //   return () => {
    //     subscription.remove();
    //   };
    // }, []);

    // const config = {
    //   androidConfig: {
    //     packageName: 'com.shree.bangur',
    //     certificateHashes: ['PeoyMZdegGTt62ZVAePnPZPgUr3UhmIomLodE4PqtFY='],
    //     supportedAlternativeStores: ['com.sec.android.app.shree.bangur'],
    //   },
    //   iosConfig: {
    //     appBundleId: 'com.shree.bangur',
    //     appTeamId: 'your_team_ID',
    //   },
    //   watcherMail: 'gourab.kundu@beas.co.in',
    //   isProd: true,
    // };

    // // reactions for detected threats
    // const actions = {
    //   // Android & iOS
    //   privilegedAccess: () => {
    //     console.log('privilegedAccess'); //Rooted
    //     BackHandler.exitApp();
    //   },
    //   // Android & iOS
    //   debug: () => {
    //     console.log('debug'); //Rooted
    //     BackHandler.exitApp();
    //   },
    //   // Android & iOS
    //   simulator: () => {
    //     console.log('simulator'); //EMulator or Rooted
    //     BackHandler.exitApp();
    //   },
    //   // Android & iOS
    //   appIntegrity: () => {
    //     //Alert.alert('appIntegrity');
    //     console.log('appIntegrity'); //Rooted
    //     BackHandler.exitApp();
    //   },
    //   // Android & iOS
    //   unofficialStore: () => {
    //     //Alert.alert('unofficialStore');
    //     console.log('unofficialStore');
    //   },
    //   // Android & iOS
    //   hooks: () => {
    //     //Alert.alert('hooks');
    //     console.log('hooks'); //Rooted
    //     BackHandler.exitApp();
    //   },
    //   // Android & iOS
    //   deviceBinding: () => {
    //     //Alert.alert('deviceBinding');
    //     console.log('deviceBinding'); //Rooted
    //     BackHandler.exitApp();
    //   },
    //   // Android & iOS
    //   secureHardwareNotAvailable: () => {
    //     //Alert.alert('secureHardwareNotAvailable');
    //     console.log('secureHardwareNotAvailable'); //Rooted
    //     BackHandler.exitApp();
    //   },
    //   // Android & iOS
    //   systemVPN: () => {
    //     //Alert.alert('systemVPN');
    //     console.log('systemVPN');
    //   },
    //   // Android & iOS
    //   passcode: () => {
    //     //Alert.alert('passcode');
    //     console.log('passcode');
    //   },
    //   // iOS only
    //   deviceID: () => {
    //     //Alert.alert('deviceID');
    //     console.log('deviceID');
    //   },
    //   // Android only
    //   obfuscationIssues: () => {
    //     //Alert.alert('obfuscationIssues');
    //     console.log('obfuscationIssues');
    //   },
    //   // Android only
    //   devMode: () => {
    //     //Alert.alert('devMode');
    //     console.log('devMode');
    //   },
    // };

    // useFreeRasp(config, actions);

    /* useEffect(() => {
      if (isRoot()) {
        BackHandler.exitApp();
      }
    }, []); */

    (0, _react.useEffect)(function () {
      _reactNative.LogBox.ignoreLogs(['Animated: `useNativeDriver`', 'Sending `onAnimatedValueUpdate` with no listeners registered.', 'Please pass alt prop to Image component']);
    }, []);
    (0, _react.useEffect)(function () {
      // getDataSSL();
      // getData();
      var testSSL = /*#__PURE__*/function () {
        var _ref = (0, _asyncToGenerator2.default)(function* () {
          try {
            var response = yield _reactNative.NativeModules.SSLPinning.makeRequest('https://apisheecementuat.mjunction.in');
            console.log('Response:', response);
          } catch (error) {
            console.error('SSL Pinning Error:', error);
          }
        });
        return function testSSL() {
          return _ref.apply(this, arguments);
        };
      }();
      testSSL();
    }, []);
    function MyStack() {
      return /*#__PURE__*/(0, _jsxRuntime.jsxs)(Stack.Navigator, {
        initialRouteName: "Splash",
        screenOptions: {
          headerShown: false
        },
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(Stack.Screen, {
          name: "Splash",
          component: _Splash.default
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(Stack.Screen, {
          name: "Intro",
          component: _Intro.default
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(Stack.Screen, {
          name: "Login",
          component: _Login.default
        })]
      });
    }
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_native.NavigationContainer, {
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.SafeAreaView, {
        style: {
          flex: 1,
          backgroundColor: '#ffffff'
        },
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(Drawer.Navigator, {
          drawerContent: function drawerContent(props) {
            return /*#__PURE__*/(0, _jsxRuntime.jsx)(_LeftMenuBar.default, Object.assign({}, props));
          },
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(Drawer.Screen, {
            name: "Welcome",
            options: {
              headerShown: false,
              swipeEnabled: false
            },
            component: MyStack
          })
        })
      })
    });
  };
  var _default = exports.default = App;
