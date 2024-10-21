import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:gap/gap.dart';
import 'package:warehouse_3d/bloc/warehouse/warehouse_interaction_bloc.dart';

class Warehouse extends StatefulWidget {
  const Warehouse({super.key});

  @override
  State<Warehouse> createState() => _WarehouseState();
}

class _WarehouseState extends State<Warehouse> {
  late WarehouseInteractionBloc _warehouseInteractionBloc;

  @override
  void initState() {
    // TODO: implement initState
    super.initState();

    _warehouseInteractionBloc = context.read<WarehouseInteractionBloc>();
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.sizeOf(context);
    return Scaffold(
      appBar: AppBar(
        // ensures scrollable widgets doesnt scroll underneath the appbar.
        scrolledUnderElevation: 0,
        elevation: 0,
        toolbarHeight: size.height * 0.08,
        backgroundColor: Colors.black45,
        title: Container(
            alignment: Alignment.center,
            height: size.height * 0.05,
            width: size.width * 0.38,
            decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(10),
                color: Colors.black,
                boxShadow: [BoxShadow(blurRadius: 10, blurStyle: BlurStyle.outer, spreadRadius: 0, color: Colors.orange.shade200, offset: const Offset(0, 0))]),
            child: const Text(
              textAlign: TextAlign.center,
              'Warehouse',
              style: TextStyle(fontWeight: FontWeight.w600, color: Colors.white, fontSize: 16),
            )),
        centerTitle: true,
      ),
      body: Container(
        height: size.height,
        width: size.width,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
              colors: [Colors.black45, Colors.black26, Colors.black45], begin: Alignment.topCenter, end: Alignment.bottomCenter, stops: [0.1, 0.5, 1]),
        ),
        child: Padding(
          padding: EdgeInsets.all(size.width * 0.032),
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  InkWell(
                    onTap: () {
                      // _warehouseInteractionBloc.state.selectedZone="Storage Area 1";
                    },
                    child: Container(
                      alignment: Alignment.center,
                      height: size.height * 0.24,
                      width: size.width * 0.3,
                      decoration: BoxDecoration(
                          color: Colors.green.shade200,
                          borderRadius: BorderRadius.circular(size.width * 0.016),
                          boxShadow: [BoxShadow(blurRadius: 5, blurStyle: BlurStyle.outer, spreadRadius: 0, color: Colors.black, offset: const Offset(0, 0))]),
                      child: Text(
                        "Storage Area 1",
                        style: TextStyle(fontSize: size.width * 0.024),
                      ),
                    ),
                  ),
                  InkWell(
                    onTap: () {
                      //  _warehouseInteractionBloc.state.selectedZone="Storage Area 2";
                    },
                    child: Container(
                      alignment: Alignment.center,
                      height: size.height * 0.24,
                      width: size.width * 0.3,
                      decoration: BoxDecoration(
                          color: Colors.green.shade200,
                          borderRadius: BorderRadius.circular(size.width * 0.016),
                          boxShadow: [BoxShadow(blurRadius: 5, blurStyle: BlurStyle.outer, spreadRadius: 0, color: Colors.black, offset: const Offset(0, 0))]),
                      child: Text(
                        "Storage Area 2",
                        style: TextStyle(fontSize: size.width * 0.024),
                      ),
                    ),
                  ),
                  InkWell(
                    onTap: () {
                      // _warehouseInteractionBloc.state.selectedZone="Storage Area 3";
                    },
                    child: Container(
                      alignment: Alignment.center,
                      height: size.height * 0.24,
                      width: size.width * 0.3,
                      decoration: BoxDecoration(
                          color: Colors.green.shade200,
                          borderRadius: BorderRadius.circular(size.width * 0.016),
                          boxShadow: [BoxShadow(blurRadius: 5, blurStyle: BlurStyle.outer, spreadRadius: 0, color: Colors.black, offset: const Offset(0, 0))]),
                      child: Text(
                        "Storage Area 3",
                        style: TextStyle(fontSize: size.width * 0.024),
                      ),
                    ),
                  )
                ],
              ),
              Gap(size.width * 0.016),
              Row(
                children: [
                  Container(
                    alignment: Alignment.center,
                    height: size.height * 0.2,
                    width: size.width * 0.32,
                    decoration: BoxDecoration(
                        color: Colors.deepPurple.shade200,
                        borderRadius: BorderRadius.circular(size.width * 0.016),
                        boxShadow: [BoxShadow(blurRadius: 5, blurStyle: BlurStyle.outer, spreadRadius: 0, color: Colors.black, offset: const Offset(0, 0))]),
                    child: Text(
                      "Staging Area",
                      style: TextStyle(fontSize: size.width * 0.02),
                    ),
                  ),
                  Spacer(),
                  Container(
                    alignment: Alignment.center,
                    height: size.height * 0.2,
                    width: size.width * 0.32,
                    decoration: BoxDecoration(
                        color: Colors.deepPurple.shade200,
                        borderRadius: BorderRadius.circular(size.width * 0.016),
                        boxShadow: [BoxShadow(blurRadius: 5, blurStyle: BlurStyle.outer, spreadRadius: 0, color: Colors.black, offset: const Offset(0, 0))]),
                    child: Text(
                      "Staging Area",
                      style: TextStyle(fontSize: size.width * 0.02),
                    ),
                  )
                ],
              ),
              Gap(size.width * 0.016),
              Row(
                children: [
                  Container(
                    alignment: Alignment.center,
                    height: size.height * 0.2,
                    width: size.width * 0.32,
                    decoration: BoxDecoration(
                        color: Colors.yellow.shade200,
                        borderRadius: BorderRadius.circular(size.width * 0.016),
                        boxShadow: [BoxShadow(blurRadius: 5, blurStyle: BlurStyle.outer, spreadRadius: 0, color: Colors.black, offset: const Offset(0, 0))]),
                    child: Text(
                      "Receiving Area",
                      style: TextStyle(fontSize: size.width * 0.02),
                    ),
                  ),
                  Spacer(),
                  Container(
                    alignment: Alignment.center,
                    height: size.height * 0.2,
                    width: size.width * 0.32,
                    decoration: BoxDecoration(
                        color: Colors.orange.shade200,
                        borderRadius: BorderRadius.circular(size.width * 0.016),
                        boxShadow: [BoxShadow(blurRadius: 5, blurStyle: BlurStyle.outer, spreadRadius: 0, color: Colors.black, offset: const Offset(0, 0))]),
                    child: Text(
                      "Shipping Area",
                      style: TextStyle(fontSize: size.width * 0.02),
                    ),
                  )
                ],
              )
            ],
          ),
        ),
      ),
    );
  }
}
