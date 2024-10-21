import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:warehouse_3d/inits/init.dart';

class AppConstants {

  // authentication constants
  static const IDCS_URL = "https://idcs-ceca8ff48a7341bebbe31aba04db25b2.identity.oraclecloud.com/";

  static const String GET_OCI_TOKEN = "oauth2/v1/token";
  static const String AUTHENCTICATE_USER_NAME = "sso/v1/sdk/authenticate";

  static const String AUTHENTICATION_USERNAME = 'a07dc2a022db4c458397118abb543e57';
  static const String AUTHENTICATION_PASSWORD = 'bf06245f-33ae-4b6c-9d0e-27fc0d89f514';

  static const Map<String, String> TOKEN_DATA = {
      'grant_type': 'client_credentials',
      'scope': 'urn:opc:idm:__myscopes__',
    };

  static Map<String, String> TOKEN_METHODHEADERS = {
      'Authorization':
          'Basic ${base64.encode(utf8.encode('$AUTHENTICATION_USERNAME:$AUTHENTICATION_PASSWORD'))}',
      'Content-Type': 'application/x-www-form-urlencoded'
    };

  static const String USERNAME = "username";


  // apex constants
  static const APEX_URL = 'https://paas.nalsoft.net:4443/ords/xxma/dms/';
}
