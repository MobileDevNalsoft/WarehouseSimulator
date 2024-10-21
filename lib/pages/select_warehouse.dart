import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:gap/gap.dart';
import 'package:lottie/lottie.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:warehouse_3d/bloc/authentication/authentication_bloc.dart';
import 'package:warehouse_3d/pages/customs/customs.dart';
import 'package:dropdown_button2/dropdown_button2.dart';
import '../inits/init.dart';
import '../navigations/navigator_service.dart';
import 'customs/loginformfield.dart';

class SelectWarehouse extends StatefulWidget {
  SelectWarehouse({super.key});

  @override
  State<SelectWarehouse> createState() => _SelectWarehouseState();
}

class _SelectWarehouseState extends State<SelectWarehouse> {

  // Service to handle navigation within the app
  final NavigatorService navigator = getIt<NavigatorService>();

  final SharedPreferences sharedPreferences = getIt();

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Scaffold(
      body: Container(
          height: size.height,
          width: size.width,
          decoration: BoxDecoration(
              // gradient: LinearGradient(
              //     colors: [Colors.blue.shade200, Colors.blue.shade100], begin: Alignment.centerLeft, end: Alignment.centerRight, stops: [0.8, 1])
              color: Colors.blue.shade100),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Image.asset('assets/images/login_decor.png', scale: 1.16,),
              Gap(size.width*0.1),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Gap(size.height*0.25),
                  const Text('Select Warehouse',style: TextStyle(
                      fontWeight: FontWeight.w900,
                      fontSize: (20), 
                    ),),
                  Gap(size.height*0.01),
                  DropdownButtonHideUnderline(
                  child: DropdownButton2<String>(
                    isExpanded: false,
                    hint: const SizedBox(),
                    
                    items: [
                      DropdownMenuItem<String>(
                          value: '0',
                          onTap: () {
                            
                          },
                          child: const Text(
                            'warehouse 1',
                            style: TextStyle(color: Colors.black),
                          ))
                    ],
                    value: '0',
                    onChanged: (String? value) {
                      navigator.push('/warehouse');
                    },
                    buttonStyleData: ButtonStyleData(
                      overlayColor: const WidgetStatePropertyAll(Colors.transparent),
                      decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(12), color: Colors.white),
                      height: size.height * (0.045),
                      width: size.width * 0.1,
                      padding: EdgeInsets.only(left: size.width * 0.008, right: size.width * 0.003),
                    ),
                    dropdownStyleData: DropdownStyleData(
                        width: size.width * (0.1),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(10),
                          color: Colors.white,
                        ),
                        offset: Offset(0, -size.height*0.003)),
                    menuItemStyleData: MenuItemStyleData(
                      overlayColor: WidgetStatePropertyAll(Colors.transparent),
                      selectedMenuItemBuilder: (context, child) {
                        return SizedBox(
                          height: size.height*0.03,
                          child: child);
                      },
                    ),
                  ),
                )
                ],
              )
            ],
          )),
    );
  }
}


/// This function validates a password string.
///
/// It checks for emptiness and minimum length (10 characters).
String? _passwordValidator(String value) {
  if (value.isEmpty) {
    return "password cannot be empty";
  } else if (value.length < 10) {
    return "password must contain atleast 10 characters";
  }
  return null;
}