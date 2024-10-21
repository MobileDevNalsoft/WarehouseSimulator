import 'package:flutter/material.dart';

// ignore: must_be_immutable
// this custom text form field is used in login button for username and password.
class CustomTextFormField extends StatelessWidget {
  TextEditingController? cont;
  String? hntTxt;
  Icon? prfxIcon;
  IconButton? sffxIcon;
  String? obscChar;
  bool? obscText;

  CustomTextFormField({super.key, required hintText, prefixIcon, suffixIcon, controller, obscureText, obscureChar}) {
    hntTxt = hintText;
    prfxIcon = prefixIcon;
    sffxIcon = suffixIcon;
    cont = controller;
    obscText = obscureText;
    obscChar = obscureChar;
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Container(
      height: size.height * 0.06,
      width: size.width*0.2,
      padding: EdgeInsets.only(left: size.width * (0.005), right: size.width * (0.005), bottom: size.height*0.02),
      decoration: BoxDecoration(borderRadius: BorderRadius.circular(15), color: Colors.white, boxShadow: const [
        BoxShadow(color: Color.fromARGB(255, 175, 175, 175), offset: Offset(0, 1), blurRadius: 5),
        BoxShadow(
          color: Colors.white70,
        ),
      ]),
      child: LayoutBuilder(builder: (context, constraints) {
        return Transform.translate(
          offset: Offset(0, -constraints.maxHeight * (-0.1)),
          child: TextFormField(
            textAlign: TextAlign.start,
            textAlignVertical: TextAlignVertical.center,
            controller: cont,
            style: TextStyle(fontSize: (20)),
            cursorColor: Colors.black,
            decoration: InputDecoration(
              border: InputBorder.none,
              contentPadding: EdgeInsets.only(left: constraints.maxWidth * 0.01, right: constraints.maxWidth * 0.01),
              hintStyle: TextStyle(color: Colors.black26, fontSize: (20)),
              hintText: hntTxt,
              prefixIcon: Transform.translate(offset: Offset(0, constraints.maxHeight * (0.12)), child: prfxIcon),
              suffixIcon: Transform.translate(offset: Offset(0, constraints.maxHeight * (0.12)), child: sffxIcon),
            ),
            obscuringCharacter: obscChar ?? '*',
            obscureText: obscText ?? false,
          ),
        );
      }),
    );
  }
}
