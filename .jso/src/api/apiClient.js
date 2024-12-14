  var _interopRequireDefault = _$$_REQUIRE(_dependencyMap[0]);
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;
  var _asyncToGenerator2 = _interopRequireDefault(_$$_REQUIRE(_dependencyMap[1]));
  var _axios = _interopRequireDefault(_$$_REQUIRE(_dependencyMap[2]));
  var _reactNative = _$$_REQUIRE(_dependencyMap[3]);
  var SSLPinning = _reactNative.NativeModules.SSLPinning;
  var apiClient = _axios.default.create({
    baseURL: 'https://apisheecementuat.mjunction.in',
    // Replace with your API base URL
    timeout: 10000 // Timeout in milliseconds
  });

  // Add request interceptor
  apiClient.interceptors.request.use(/*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2.default)(function* (config) {
      try {
        // Call SSL validation before sending the request
        console.log('CALLING...', SSLPinning);
        yield SSLPinning.validateCertificate(config.baseURL,
        // API URL
        'mjunction_combined.cer' // Local certificate in assets
        );
        console.log('validation success');
        // Proceed with the request if SSL validation is successful
        return config;
      } catch (error) {
        console.error('SSL Certificate Validation Failed:', error.message);

        // Cancel the request and throw an error
        throw new _axios.default.Cancel(`Certificate validation failed: ${error.message}`);
      }
    });
    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }(), function (error) {
    // Handle request errors
    return Promise.reject(error);
  });
  var _default = exports.default = apiClient;
