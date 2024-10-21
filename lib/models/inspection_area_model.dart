class InspectionArea {
  String? areaName;
  List<Material>? materials;
  InspectionArea({this.areaName, this.materials = const []});

  InspectionArea.fromJson(Map<String, dynamic> json) {
    areaName = json['area_name'];
    materials = (json['materials'] as List).map((e) => Material.fromJson(e)).toList();
  }
}

class Material {
  String? asn;
  String? po;
  String? item;
  String? lpn;
  int? quantity;
  Material({this.asn, this.po, this.item, this.lpn, this.quantity});

  Material.fromJson(Map<String, dynamic> json) {
    asn = json['asn'];
    po = json['po'];
    item = json['item'];
    lpn = json['lpn'];
    quantity = json['qty'];
  }
}
