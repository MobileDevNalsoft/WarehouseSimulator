import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

class OnHoverButton extends StatefulWidget {
  OnHoverButton({super.key, required this.child});

  Widget child;

  @override
  State<OnHoverButton> createState() => _OnHoverButtonState();
}

class _OnHoverButtonState extends State<OnHoverButton> {
  bool _isHovered = false;

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return InkWell(
      onTap: (){},
      onHover: (value) => setState(() {
        _isHovered = value;
      }),
      child: Stack(
        children: [
          widget.child,
          if(_isHovered)
          Positioned(
            right: 0,
            top: 0,
            bottom: 0,
            left: 0,
            child: AnimatedContainer(duration: Duration(milliseconds: 300), height: _isHovered ? size.height*0.2:0, width: size.width*0.3, decoration: BoxDecoration(color: Colors.black),),
          )
        ],
      ),
    );
  }
}