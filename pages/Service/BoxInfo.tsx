import { reference } from "@/assets/reference";
import { IService } from "@/interfaces/ServiceInterface";
import { IUnit } from "@/interfaces/UnitInterface";
import ServiceManagerService from "@/services/Service/ServiceManagerService";
import UnitService from "@/services/Unit/UnitService";

import Box from "@/ui/Box";
import Dropdown from "@/ui/Dropdown";
import Input from "@/ui/Input";
import Label from "@/ui/Label";
import { isArray } from "lodash";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import React from "react";

const BoxInfo = forwardRef<
  { isLoading: boolean },
  {
    service: IService | null;
    setService: (type: IService | null) => void;
    unit: IUnit | null;
    setUnit: (unit: IUnit | null) => void;
    price: string;
    setPrice: (price: string) => void;
    name: string;
    setName: (name: string) => void;
    isUpdate?: boolean;
  }
>(
  (
    {
      service,
      setService,
      name,
      setName,
      unit,
      price,
      setPrice,
      setUnit,
      isUpdate,
    },
    ref
  ) => {
    const [services, setServices] = useState<IService[]>([]);
    const [units, setUnits] = useState<IUnit[]>([]);
    const [unitMap, setUnitMap] = useState<Record<number, number[]>>({});
    const [loadingServices, setLoadingServices] = useState(false);
    const [loadingUnits, setLoadingUnits] = useState(false);
    const [loadingMaps, setLoadingMap] = useState(false);


    const unitService = new UnitService();
    const serviceManagerService = new ServiceManagerService();


    useImperativeHandle(ref, () => ({
      isLoading: loadingServices || loadingUnits,
    }));

    // Fetch service and unit data
    const fetchData = useCallback(async () => {
      setLoadingServices(true);
      setLoadingUnits(true);
      try {
        const [dataServices, dataUnits] = await Promise.all([
          serviceManagerService.listService(),
          unitService.listUnit(),
        ]);
        if (isArray(dataServices)) {
          setServices([...dataServices, { id: 0, name: "other" }]);
          !isUpdate
            ? setService(dataServices[0])
            : setService(service ? { ...service } : { id: 0, name: "other" });
        }

        if (isArray(dataUnits)) {
          setUnits(dataUnits);
        }
      } catch (error) {
        console.error("Error fetching services and units:", error);
      } finally {
        setLoadingServices(false);
        setLoadingUnits(false);
      }
    }, [service, isUpdate]);

    // Fetch initial data
    useEffect(() => {
      fetchData();
    }, []);


    // Fetch unit map for the selected service
    const fetchUnitMap = useCallback(
      async (serviceId: number) => {
        setLoadingMap(true);
        try {
          let data =
            serviceId !== 0
              ? await unitService.listUnitsByService(serviceId)
              : units;
          if (Array.isArray(data)) {
            let unitArray: IUnit[] = data as IUnit[];
            if (unitArray.length === 0) unitArray = units;

            setUnitMap((prev) => ({
              ...prev,
              [serviceId]: unitArray.map((item) => item.id),
            }));
          }
        } catch (error) {
        } finally {
          setLoadingMap(false);
        }
      },
      [units]
    );

    // Fetch unit map when a service is selected
    useEffect(() => {
      if (typeof service?.id === "number" && !unitMap[service?.id]) {
        fetchUnitMap(service.id);
      }
    }, [service, fetchUnitMap, unitMap]);

    useEffect(() => {
      if (!service || !unitMap[service.id]) return;
      !isUpdate
        ? setUnit(
            units.filter((item) => unitMap[service.id].includes(item.id))[0] ??
              null
          )
        : setUnit(unit ? { ...unit } : null);
    }, [service, unitMap]);

    useEffect(() => {
      if (!service) {
        setService(services.find((item) => item.id === 0) ?? null);
      }
    }, [service, services]);

    // Format unit suffix based on selected unit
    const getUnitSuffix = useCallback(() => {
      if (!unit) return reference.undefined.name;
      return unitService.getUnitSuffix("đồng", unit);
    }, [unit]);

    return (
      <Box title="Thông tin dịch vụ" className="z-10">
        <Dropdown
          options={services}
          hasSearch={false}
          value={service}
          optionKey="name"
          renderOption={(option) => {
            return serviceManagerService.getReferenceService(option).name;
          }}
          placeHolder="Chọn dịch vụ"
          label="Dịch vụ"
          onChange={(option) => setService(option)}
          loading={loadingServices}
        />

        {/* Input for custom service name when "other" is selected */}
        {!loadingServices && !service?.id && (
          <Input
            value={name}
            onChange={(name) => setName(name)}
            label="Tên dịch vụ"
          />
        )}

        {/* Unit dropdown */}
        <Dropdown
          options={
            !service?.id
              ? units
              : unitMap[service.id] && unitMap[service.id].length > 0
              ? units.filter((item) => unitMap[service.id]?.includes(item.id))
              : units
          }
          hasSearch={false}
          value={unit}
          optionKey="name"
          renderOption={(option) => {
            return unitService.getReferenceUnit(option);
          }}
          placeHolder="Chọn đơn vị tính"
          label="Đơn vị tính"
          onChange={(option) => setUnit(option)}
          loading={loadingMaps || loadingUnits}
        />

        {/* Price input */}

        {!loadingUnits && !loadingMaps && (
          <Input
            value={price}
            onChange={(price) => setPrice(price)}
            label="Giá dịch vụ"
            type="number"
            suffix={<Label label={getUnitSuffix()} />}
          />
        )}
      </Box>
    );
  }
);

export default BoxInfo;
