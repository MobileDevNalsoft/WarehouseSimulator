// import 'package:flutter/services.dart';
// import 'package:xml/xml.dart';

// import '../models/rack_model.dart';

// Future<List<RackData>> loadSvgImage({required String svgImage}) async {
//   List<RackData> rackSlots = [];

//   String generalString = await rootBundle.loadString(svgImage);

//   XmlDocument document = XmlDocument.parse(generalString);

//   final paths = document.findAllElements('path');

//   paths.forEach((element) {
//     String rackId = element.getAttribute('id').toString();
//     String path = element.getAttribute('d').toString();

//     RackData part = RackData(rackId: rackId, path: path);
//     rackSlots.add(part);
//   });
//   return rackSlots;
// }
