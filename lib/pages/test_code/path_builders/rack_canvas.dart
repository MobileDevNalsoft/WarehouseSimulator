// import 'package:flutter/material.dart';
// import 'package:touchable/touchable.dart';

// import '../models/rack_model.dart';
// import 'rack_painter.dart';

// class RackCanvas extends StatelessWidget {
//   final List<RackData> rackSlots;

//   //General Parts for vehicle examination view
//   //remaining for quality check view.
//   const RackCanvas({super.key,required this.rackSlots});

//   @override
//   Widget build(BuildContext context) {
//     return CanvasTouchDetector(
//       gesturesToOverride: const [GestureType.onTapDown],
//       builder: (context) => CustomPaint(
//         painter: RackPainter(
//             context: context,
//             rackSlots: rackSlots,),
//       ),
//     );
//   }
// }
