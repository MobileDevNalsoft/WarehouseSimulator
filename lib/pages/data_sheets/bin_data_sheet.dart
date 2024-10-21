import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:gap/gap.dart';
import 'package:skeletonizer/skeletonizer.dart';
import 'package:warehouse_3d/bloc/warehouse/warehouse_interaction_bloc.dart';
import 'package:warehouse_3d/pages/customs/customs.dart';

class BinDataSheet extends StatefulWidget {
  const BinDataSheet({super.key});

  @override
  State<BinDataSheet> createState() => _BinDataSheetState();
}

class _BinDataSheetState extends State<BinDataSheet> {
  late WarehouseInteractionBloc _warehouseInteractionBloc;

  @override
  void initState() {
    super.initState();
    _warehouseInteractionBloc = context.read<WarehouseInteractionBloc>();
    _warehouseInteractionBloc.add(SelectedBin(binID: _warehouseInteractionBloc.state.dataFromJS!['bin']));
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;

    return Customs.DataSheet(
      context: context,
      size: size, 
      title: 'Storage Bin', children: [
      BlocBuilder<WarehouseInteractionBloc, WarehouseInteractionState>(
        builder: (context, state) {
          bool isEnabled = false;
          // state.selectedBin == null;
          return Skeletonizer(
            enabled: isEnabled,
            child: Column(
              children: [
                Text(
                  isEnabled ? 'Bin ID' : state.dataFromJS!.values.first,
                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
                ),
                Gap(size.height * 0.02),
                if (context.watch<WarehouseInteractionBloc>().state.selectedBin != null)
                  SizedBox(
                    height: size.height * 0.6,
                    child: ListView.separated(
                      itemCount: isEnabled ? 8 : state.selectedBin!.items!.length,
                      itemBuilder: (context, index) => isEnabled
                          ? SizedBox(
                              width: size.width * 0.1,
                              height: size.height * 0.05,
                            )
                          : Customs.MapInfo(
                              size: size,
                              keys: ['Item Name', 'Quantity'],
                              values: [state.selectedBin!.items![index].itemName!, state.selectedBin!.items![index].quantity!.toString()]),
                      separatorBuilder: (context, index) => Gap(size.height * 0.05),
                    ),
                  ),
                if (context.watch<WarehouseInteractionBloc>().state.selectedBin != null)
                  Align(alignment: Alignment.bottomRight, child: Padding(
                    padding:  EdgeInsets.only(right: size.width*0.01),
                    child: InkWell(
                      onTap: () {
                        
                      },
                      child: Text('view more details', style: TextStyle(color: Colors.blue, decoration: TextDecoration.underline),)),
                  ),),
                if (context.watch<WarehouseInteractionBloc>().state.selectedBin == null)
                  SizedBox(
                    height: size.height * 0.2,
                    child: const Center(
                      child: Text('This Bin is Empty'),
                    ),
                  )
              ],
            ),
          );
        },
      ),
    ]);
  }
}
