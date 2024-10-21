import 'dart:async';

class WarehouseData {
  List<ZoneData>? zones;
  WarehouseData({this.zones});

  WarehouseData.fromJson(Map<String, dynamic> json) {
    zones = (json['warehouse']['zones'] as List).map((e) => ZoneData.fromJson(e)).toList();
  }
}

class ZoneData {
  String? zoneID;
  List<RackData>? racks;

  ZoneData({this.zoneID, this.racks});

  ZoneData.fromJson(Map<String, dynamic> json) {
    zoneID = json['zone_id'];
    racks = (json['racks'] as List).map((e) => RackData.fromJson(e)).toList();
  }
}

class RackData {
  String? type;
  String? ID;
  int? capacity;
  List<BinData>? bins;
  RackData({this.type, this.ID, this.capacity, this.bins});

  RackData.fromJson(Map<String, dynamic> json) {
    type = json['type'];
    ID = json['id'];
    capacity = json['capacity'];
    bins = ((json['bins'] ?? []) as List).map((e) => BinData.fromJson(e)).toList();
  }
}

class BinData {
  String? binID;
  int? capacity;
  int? totalQuantity;
  List<ItemData>? items;

  BinData({this.binID, this.capacity, this.items, this.totalQuantity = 0});

  BinData.fromJson(Map<String, dynamic> json) {
    binID = json['bin_id'];
    capacity = json['capacity'];
    items = ((json['items'] ?? []) as List).map((e) => ItemData.fromJson(e)).toList();
    items!.forEach((e) => totalQuantity = (totalQuantity ?? 0) + (e.quantity ?? 0));
  }
}

class ItemData {
  String? itemName;
  int? quantity;
  ItemData({this.itemName, this.quantity});

  ItemData.fromJson(Map<String, dynamic> json) {
    itemName = json['itemName'];
    quantity = json['quantity'];
  }
}
