class ReceivingArea {
  String? areaName;
  List<Material>? materials;
  ReceivingArea({this.areaName, this.materials = const []});

  ReceivingArea.fromJson(Map<String, dynamic> json) {
    areaName = json['area_name'];
    materials = (json['materials'] as List).map((e) => Material.fromJson(e)).toList();
  }
}

class Material {
  String? asn;
  List<String>? pos;
  int? lpns;
  int? quantity;
  Material({this.asn, this.pos, this.lpns, this.quantity});

  Material.fromJson(Map<String, dynamic> json) {
    asn = json['asn'];
    pos = (json['pos'] as List).map((e) => e.toString()).toList();
    lpns = json['lpns'];
    quantity = json['qty'];
  }
}
