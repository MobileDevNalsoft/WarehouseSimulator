part of 'warehouse_interaction_bloc.dart';

abstract class WarehouseInteractionEvent extends Equatable {
  @override
  List<Object> get props => [];
}

class SelectedObject extends WarehouseInteractionEvent {
  final Map<String, dynamic> dataFromJS;
  SelectedObject({required this.dataFromJS});

  @override
  List<Object> get props => [dataFromJS];
}

class GetRacksData extends WarehouseInteractionEvent {}

class SelectedRack extends WarehouseInteractionEvent {
  final String rackID;
  SelectedRack({required this.rackID});

  @override
  List<Object> get props => [rackID];
}

class SelectedBin extends WarehouseInteractionEvent {
  final String binID;
  SelectedBin({required this.binID});

  @override
  List<Object> get props => [binID];
}

class GetStagingAreaData extends WarehouseInteractionEvent {
  final String areaName;
  GetStagingAreaData({required this.areaName});

  @override
  List<Object> get props => [areaName];
}

class GetReceivingAreaData extends WarehouseInteractionEvent {
  final String areaName;
  GetReceivingAreaData({required this.areaName});

  @override
  List<Object> get props => [areaName];
}

class GetActivityAreaData extends WarehouseInteractionEvent {
  final String areaName;
  GetActivityAreaData({required this.areaName});

  @override
  List<Object> get props => [areaName];
}

class GetInspectionAreaData extends WarehouseInteractionEvent {
  final String areaName;
  GetInspectionAreaData({required this.areaName});

  @override
  List<Object> get props => [areaName];
}

class ModelLoaded extends WarehouseInteractionEvent {
  final bool isLoaded;
  ModelLoaded({required this.isLoaded});

  @override
  List<Object> get props => [isLoaded];
}
