import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:gap/gap.dart';
import 'package:skeletonizer/skeletonizer.dart';
import 'package:warehouse_3d/bloc/warehouse/warehouse_interaction_bloc.dart';
import 'package:warehouse_3d/inits/init.dart';
import 'package:warehouse_3d/js_interop_service/js_inter.dart';
import 'package:warehouse_3d/pages/customs/customs.dart';

class StagingAreaDataSheet extends StatefulWidget {
  const StagingAreaDataSheet({super.key});

  @override
  State<StagingAreaDataSheet> createState() => _StagingAreaDataSheetState();
}

class _StagingAreaDataSheetState extends State<StagingAreaDataSheet> {
  late WarehouseInteractionBloc _warehouseInteractionBloc;

  @override
  void initState() {
    super.initState();

    _warehouseInteractionBloc = context.read<WarehouseInteractionBloc>();
    if (_warehouseInteractionBloc.state.getStagingAreaDataState == GetStagingAreaDataState.initial) {
      _warehouseInteractionBloc.add(GetStagingAreaData(areaName: _warehouseInteractionBloc.state.dataFromJS!.values.first.toString()));
    }
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;

    return Customs.DataSheet(
      context: context,
      size: size,
      title: 'Staging Area',
      children: [
        const Text(
            'Materials',
            style: TextStyle(fontWeight: FontWeight.w500, fontSize: 16),
            textAlign: TextAlign.center,
          ),
          Gap(size.height * 0.02),
          BlocBuilder<WarehouseInteractionBloc, WarehouseInteractionState>(
            builder: (context, state) {
              bool isEnabled = state.getStagingAreaDataState != GetStagingAreaDataState.success;
              return Skeletonizer(
                  enabled: isEnabled,
                  enableSwitchAnimation: true,
                  child: SizedBox(
                    height: size.height * 0.6,
                    child: ListView.separated(
                        itemBuilder: (context, index) => Customs.MapInfo(size: size, keys: [
                              'Order Number',
                              'OB Load',
                              'Item',
                              'Quantity'
                            ], values: [
                              isEnabled ? 'Order Number' : state.stagingArea!.materials![index].orderNumber!,
                              isEnabled ? 'OB Load' : state.stagingArea!.materials![index].obLoad!,
                              isEnabled ? 'Item' : state.stagingArea!.materials![index].item!,
                              isEnabled ? 'Quantity' : state.stagingArea!.materials![index].quantity!.toString()
                            ]),
                        separatorBuilder: (context, index) => Gap(size.height * 0.025),
                        itemCount: isEnabled ? 8 : state.stagingArea!.materials!.length),
                  ));
            },
          )
      ]
    );
  }
}
