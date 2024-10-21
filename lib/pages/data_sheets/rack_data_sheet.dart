import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:gap/gap.dart';
import 'package:skeletonizer/skeletonizer.dart';
import 'package:warehouse_3d/bloc/warehouse/warehouse_interaction_bloc.dart';
import 'package:warehouse_3d/pages/customs/customs.dart';

class RackDataSheet extends StatefulWidget {
  const RackDataSheet({
    super.key,
  });

  @override
  State<RackDataSheet> createState() => _RackDataSheetState();
}

class _RackDataSheetState extends State<RackDataSheet> with TickerProviderStateMixin {
  late WarehouseInteractionBloc _warehouseInteractionBloc;

  @override
  void initState() {
    super.initState();

    _warehouseInteractionBloc = context.read<WarehouseInteractionBloc>();
    if (_warehouseInteractionBloc.state.getRacksDataState == GetRacksDataState.initial) {
      _warehouseInteractionBloc.add(GetRacksData());
    }
    if(_warehouseInteractionBloc.state.getRacksDataState == GetRacksDataState.success) {
      _warehouseInteractionBloc.add(SelectedRack(rackID: _warehouseInteractionBloc.state.dataFromJS!['rack']));
    }
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;

    print('built rack sheet');

    return Customs.DataSheet(
      context: context,
      size: size,
      title: 'Storage Rack',
      children: [
        BlocBuilder<WarehouseInteractionBloc, WarehouseInteractionState>(
          builder: (context, state) {
            bool isEnabled = state.getRacksDataState != GetRacksDataState.success;
            return Skeletonizer(
                enabled: isEnabled,
                enableSwitchAnimation: true,
                child: Column(
                  children: [
                    Text(
                      isEnabled ? 'Rack ID' : state.dataFromJS!['rack'],
                      style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
                    ),
                    Gap(size.height * 0.02),
                    if (context.watch<WarehouseInteractionBloc>().state.selectedRack != null)
                      Customs.MapInfo(
                          size: size,
                          keys: ['Category', 'Number of Bins'],
                          values: [isEnabled ? 'Category' : state.selectedRack!.category!, isEnabled ? '50' : state.selectedRack!.bins!.length.toString()]),
                    if (context.watch<WarehouseInteractionBloc>().state.selectedRack == null)
                      SizedBox(
                        height: size.height * 0.2,
                        child: const Center(
                          child: Text('This Rack is Empty'),
                        ),
                      )
                  ],
                ));
          },
        )
      ],
    );
  }
}
