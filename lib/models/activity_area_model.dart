class ActivityArea {
  String? areaName;
  List<Material>? materials;
  ActivityArea({this.areaName, this.materials = const []});

  ActivityArea.fromJson(Map<String, dynamic> json) {
    areaName = json['area_name'];
    materials = (json['materials'] as List).map((e) => Material.fromJson(e)).toList();
  }
}

class Material {
  String? workOrderNumber;
  String? workOrderType;
  String? status;
  int? quantity;
  Material({this.workOrderNumber, this.workOrderType, this.status, this.quantity});

  Material.fromJson(Map<String, dynamic> json) {
    workOrderNumber = json['work_order_number'];
    workOrderType = json['work_order_type'];
    status = json['status'];
    quantity = json['qty'];
  }
}
