import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:gap/gap.dart';
import 'package:skeletonizer/skeletonizer.dart';
import 'package:warehouse_3d/bloc/warehouse/warehouse_interaction_bloc.dart';
import 'package:warehouse_3d/inits/init.dart';
import 'package:warehouse_3d/js_interop_service/js_inter.dart';
import 'package:warehouse_3d/pages/customs/customs.dart';

class ReceivingAreaDataSheet extends StatefulWidget {
  const ReceivingAreaDataSheet({super.key});

  @override
  State<ReceivingAreaDataSheet> createState() => _ReceivingAreaDataSheetState();
}

class _ReceivingAreaDataSheetState extends State<ReceivingAreaDataSheet> {
  late WarehouseInteractionBloc _warehouseInteractionBloc;

  @override
  void initState() {
    super.initState();

    _warehouseInteractionBloc = context.read<WarehouseInteractionBloc>();
    if (_warehouseInteractionBloc.state.getReceivingAreaDataState == GetReceivingAreaDataState.initial) {
      _warehouseInteractionBloc.add(GetReceivingAreaData(areaName: _warehouseInteractionBloc.state.dataFromJS!.values.first.toString()));
    }
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;

    return Customs.DataSheet(
      context: context,
      size: size,
      title: 'Receiving Area',
      children: [
        const Text(
            'Materials',
            style: TextStyle(fontWeight: FontWeight.w500, fontSize: 16),
            textAlign: TextAlign.center,
          ),
          Gap(size.height * 0.02),
          BlocBuilder<WarehouseInteractionBloc, WarehouseInteractionState>(
            builder: (context, state) {
              bool isEnabled = state.getReceivingAreaDataState != GetReceivingAreaDataState.success;
              return Skeletonizer(
                  enabled: isEnabled,
                  enableSwitchAnimation: true,
                  child: SizedBox(
                    height: size.height * 0.6,
                    child: ListView.separated(
                        itemBuilder: (context, index) => Customs.MapInfo(size: size, keys: [
                              'ASN',
                              'POs',
                              'LPN',
                              'Quantity'
                            ], values: [
                              isEnabled ? 'ASN' : state.receivingArea!.materials![index].asn!,
                              isEnabled ? 'POs' : state.receivingArea!.materials![index].pos!.first,
                              isEnabled ? 'LPN' : state.receivingArea!.materials![index].lpns!.toString(),
                              isEnabled ? 'Quantity' : state.receivingArea!.materials![index].quantity!.toString()
                            ]),
                        separatorBuilder: (context, index) => Gap(size.height * 0.025),
                        itemCount: isEnabled ? 8 : state.receivingArea!.materials!.length),
                  ));
            },
          )
      ]
    );
  }
}
