import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:gap/gap.dart';
import 'package:skeletonizer/skeletonizer.dart';
import 'package:warehouse_3d/bloc/warehouse/warehouse_interaction_bloc.dart';
import 'package:warehouse_3d/inits/init.dart';
import 'package:warehouse_3d/js_interop_service/js_inter.dart';
import 'package:warehouse_3d/pages/customs/customs.dart';

class InspectionAreaDataSheet extends StatefulWidget {
  const InspectionAreaDataSheet({super.key});

  @override
  State<InspectionAreaDataSheet> createState() => _InspectionAreaDataSheetState();
}

class _InspectionAreaDataSheetState extends State<InspectionAreaDataSheet> {
  late WarehouseInteractionBloc _warehouseInteractionBloc;

  @override
  void initState() {
    super.initState();

    _warehouseInteractionBloc = context.read<WarehouseInteractionBloc>();
    if (_warehouseInteractionBloc.state.getInspectionAreaDataState == GetInspectionAreaDataState.initial) {
      _warehouseInteractionBloc.add(GetInspectionAreaData(areaName: _warehouseInteractionBloc.state.dataFromJS!.values.first.toString()));
    }
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;

    return Customs.DataSheet(
      context: context,
      size: size,
      title: 'Inspection Area',
      children: [
        const Text(
            'Materials',
            style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
            textAlign: TextAlign.center,
          ),
          Gap(size.height * 0.02),
          BlocBuilder<WarehouseInteractionBloc, WarehouseInteractionState>(
            builder: (context, state) {
              bool isEnabled = state.getInspectionAreaDataState != GetInspectionAreaDataState.success;
              return Skeletonizer(
                  enabled: isEnabled,
                  enableSwitchAnimation: true,
                  child: SizedBox(
                    height: size.height * 0.6,
                    child: ListView.separated(
                        itemBuilder: (context, index) => Customs.MapInfo(size: size, keys: [
                              'ASN',
                              'PO',
                              'Item',
                              'LPN',
                              'Quantity'
                            ], values: [
                              isEnabled ? 'ASN' : state.inspectionArea!.materials![index].asn!,
                              isEnabled ? 'PO' : state.inspectionArea!.materials![index].po!,
                              isEnabled ? 'Item' : state.inspectionArea!.materials![index].item!,
                              isEnabled ? 'LPN' : state.inspectionArea!.materials![index].lpn!.toString(),
                              isEnabled ? 'Quantity' : state.inspectionArea!.materials![index].quantity!.toString()
                            ]),
                        separatorBuilder: (context, index) => Gap(size.height * 0.025),
                        itemCount: isEnabled ? 8 : state.inspectionArea!.materials!.length),
                  ));
            },
          )
      ]
    );
  }
}
