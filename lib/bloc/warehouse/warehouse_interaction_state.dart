part of 'warehouse_interaction_bloc.dart';

enum GetRacksDataState { initial, loading, success, failure }

enum GetStagingAreaDataState { initial, loading, success, failure }

enum GetActivityAreaDataState { initial, loading, success, failure }

enum GetReceivingAreaDataState { initial, loading, success, failure }

enum GetInspectionAreaDataState { initial, loading, success, failure }

final class WarehouseInteractionState extends Equatable {
  WarehouseInteractionState(
      {this.racksData,
      this.getRacksDataState,
      this.selectedRack,
      this.selectedBin,
      this.stagingArea,
      this.getStagingAreaDataState,
      this.activityArea,
      this.getActivityAreaDataState,
      this.receivingArea,
      this.getReceivingAreaDataState,
      this.inspectionArea,
      this.getInspectionAreaDataState,
      this.dataFromJS,
      this.inAppWebViewController,
      this.isModelLoaded=false});

  List<Rack>? racksData;
  GetRacksDataState? getRacksDataState;
  Rack? selectedRack;
  Bin? selectedBin;
  StagingArea? stagingArea;
  GetStagingAreaDataState? getStagingAreaDataState;
  ActivityArea? activityArea;
  GetActivityAreaDataState? getActivityAreaDataState;
  ReceivingArea? receivingArea;
  GetReceivingAreaDataState? getReceivingAreaDataState;
  InspectionArea? inspectionArea;
  GetInspectionAreaDataState? getInspectionAreaDataState;
  Map<String, dynamic>? dataFromJS;
  InAppWebViewController? inAppWebViewController;
  bool isModelLoaded;

  factory WarehouseInteractionState.initial() {
    return WarehouseInteractionState(
        getRacksDataState: GetRacksDataState.initial,
        getStagingAreaDataState: GetStagingAreaDataState.initial,
        getActivityAreaDataState: GetActivityAreaDataState.initial,
        getReceivingAreaDataState: GetReceivingAreaDataState.initial,
        getInspectionAreaDataState: GetInspectionAreaDataState.initial,
        dataFromJS: const {"object": "null"},
        isModelLoaded: false
        );
  }

  WarehouseInteractionState copyWith({
    List<Rack>? racksData,
    GetRacksDataState? getRacksDataState,
    Rack? selectedRack,
    Bin? selectedBin,
    StagingArea? stagingArea,
    GetStagingAreaDataState? getStagingAreaDataState,
    ActivityArea? activityArea,
    GetActivityAreaDataState? getActivityAreaDataState,
    ReceivingArea? receivingArea,
    GetReceivingAreaDataState? getReceivingAreaDataState,
    InspectionArea? inspectionArea,
    GetInspectionAreaDataState? getInspectionAreaDataState,
    Map<String, dynamic>? dataFromJS,
    InAppWebViewController? inAppWebViewController,
    bool? isModelLoaded
  }) {
    return WarehouseInteractionState(
      racksData: racksData ?? this.racksData,
      getRacksDataState: getRacksDataState ?? this.getRacksDataState,
      selectedRack: selectedRack ?? this.selectedRack,
      selectedBin: selectedBin,
      stagingArea: stagingArea ?? this.stagingArea,
      getStagingAreaDataState: getStagingAreaDataState ?? this.getStagingAreaDataState,
      activityArea: activityArea ?? this.activityArea,
      getActivityAreaDataState: getActivityAreaDataState ?? this.getActivityAreaDataState,
      receivingArea: receivingArea ?? this.receivingArea,
      getReceivingAreaDataState: getReceivingAreaDataState ?? this.getReceivingAreaDataState,
      inspectionArea: inspectionArea ?? this.inspectionArea,
      getInspectionAreaDataState: getInspectionAreaDataState ?? this.getInspectionAreaDataState,
      dataFromJS: dataFromJS ?? this.dataFromJS,
      inAppWebViewController: inAppWebViewController?? this.inAppWebViewController,
      isModelLoaded: isModelLoaded??this.isModelLoaded
    );
  }

  @override
  List<Object?> get props => [
        selectedRack,
        selectedBin,
        receivingArea,
        inspectionArea,
        activityArea,
        stagingArea,
        dataFromJS,
        getRacksDataState,
        getStagingAreaDataState,
        getActivityAreaDataState,
        getReceivingAreaDataState,
        getInspectionAreaDataState,
        racksData,
        isModelLoaded
      ];
}
