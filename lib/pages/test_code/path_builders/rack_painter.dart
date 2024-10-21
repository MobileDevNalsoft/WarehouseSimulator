// import 'package:flutter/material.dart';
// import 'package:touchable/touchable.dart';
// import 'package:warehouse_3d/models/rack_model.dart';
// import 'package:svg_path_parser/svg_path_parser.dart';

// class RackPainter extends CustomPainter{
//   final BuildContext context;
//   List<RackData> rackSlots;

//   RackPainter({required this.context, required this.rackSlots});

//   @override
//   void paint(Canvas canvas, Size size) {
//     Paint paint = Paint()
//       ..style = PaintingStyle.fill
//       ..strokeWidth = 8.0;

//     Size contextSize = MediaQuery.of(context).size;

//     final Matrix4 matrix4 = Matrix4.identity();

//     //scale
//     var xScale = contextSize.width / contextSize.width * 0.4;
//     var yScale = contextSize.height * 0.96 / contextSize.height * 0.8;

//     //position
//     double translateX = (contextSize.width - contextSize.width * xScale * 0.96) / 2;
//     double translateY = (contextSize.height * 0.96 - contextSize.height * 1.5 * yScale) / 2;

//     matrix4.translate(translateX, translateY);
//     matrix4.scale(xScale*2, yScale*1.5);

//     TouchyCanvas rackCanvas = TouchyCanvas(context, canvas);

//     for(RackData slot in rackSlots){
//       Path path = parseSvgPath(slot.path);

//       paint.color = Colors.white;

//       rackCanvas.drawPath(path.transform(matrix4.storage), paint, onTapDown: (details){
//         print('tapped on ${slot.rackId}');
//         print('capacity ${slot.capacity}');
//       });
//     }
//   }

//   @override
//   bool shouldRepaint(covariant CustomPainter oldDelegate) {
//     return true;
//   }
// }