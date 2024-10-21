class Rack {
  String? rackID;
  String? category;
  List<Bin>? bins;

  Rack({required this.rackID, required this.category, this.bins = const []});

  Rack.fromJson(Map<String, dynamic> json) {
    rackID = json["rack_id"];
    category = json["category"];
    bins = (json["bins"] as List).map((e) => Bin.fromJson(e)).toList();
  }
}

class Bin {
  String? binID;
  List<Item>? items;
  Bin({this.binID, this.items = const []});

  Bin.fromJson(Map<String, dynamic> json) {
    binID = json["bin_id"];
    items = (json["items"] as List).map((e) => Item.fromJson(e)).toList();
  }
}

class Item {
  String? itemName;
  int? quantity;
  Item({this.itemName, this.quantity});

  Item.fromJson(Map<String, dynamic> json) {
    itemName = json["item_name"];
    quantity = json["quantity"];
  }
}
