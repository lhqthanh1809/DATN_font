import { apiRouter } from "@/assets/ApiRouter";
import { constant } from "@/assets/constant";
import { reference } from "@/assets/reference";

import { useGeneral } from "@/hooks/useGeneral";
import { LodgingType } from "@/interfaces/LodgingInterface";
import { IResponse } from "@/interfaces/ResponseInterface";
import { IService } from "@/interfaces/ServiceInterface";
import { IUnit } from "@/interfaces/UnitInterface";
import ServiceManagerService from "@/services/Service/ServiceManagerService";
import UnitService from "@/services/Unit/UnitService";

import Box from "@/ui/box";
import Dropdown from "@/ui/dropdown";
import Input from "@/ui/input";
import Label from "@/ui/label";
import { isArray } from "lodash";
import { useCallback, useEffect, useState } from "react";
import React from "react";

const BoxInfo: React.FC<{
  service: IService | null;
  setService: (type: IService | null) => void;

  unit: IUnit | null;
  setUnit: (unit: IUnit | null) => void;

  price: string;
  setPrice: (price: string) => void;

  name: string;
  setName: (name: string) => void;
}> = ({
  service,
  setService,
  name,
  setName,
  unit,
  price,
  setPrice,
  setUnit,
}) => {
  const [services, setServices] = useState<IService[]>([]);
  const [units, setUnits] = useState<IUnit[]>([]);
  const [unitMap, setUnitMap] = useState<Record<number, number[]>>({});
  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [loadingMaps, setLoadingMap] = useState(false);

  const unitService = new UnitService();
  const serviceManagerService = new ServiceManagerService();

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
        setServices(dataServices);
        setService(dataServices[0]);
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
  }, []);

  // Fetch unit map for the selected service
  const fetchUnitMap = useCallback(async (serviceId: number) => {
    setLoadingMap(true);
    try {
      const data = await unitService.listUnitsByService(serviceId);
      if (isArray(data)) {
        setUnitMap((prev) => ({
          ...prev,
          [serviceId]: data.map((item) => item.id),
        }));
      }
    } catch (error) {
    } finally {
      setLoadingMap(false);
    }
  }, []);

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch unit map when a service is selected
  useEffect(() => {
    if (service?.id && !unitMap[service.id]) {
      fetchUnitMap(service.id);
    }
  }, [service, unitMap, fetchUnitMap]);

  useEffect(() => {
    if (!service || !unitMap[service.id]) return;
    if (service.id === 0 || unitMap[service.id].length == 0) {
      setUnit(units[0]);
      return;
    }
    setUnit(
      units.filter((item) => unitMap[service.id].includes(item.id))[0] ?? null
    );
  }, [service, unitMap]);

  // Format unit suffix based on selected unit
  const getUnitSuffix = useCallback(() => {
    if (!unit) return reference.undefined.name;
    return unitService.getUnitSuffix("đồng", unit);
  }, [unit]);

  return (
    <Box title="Thông tin dịch vụ" className="z-10">
      <Dropdown
        options={[...services, { id: 0, name: "other" }]}
        hasSearch={false}
        value={service}
        optionKey="name"
        renderOption={(option) => {
          return serviceManagerService.getReferenceService(option).name
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
};

export { BoxInfo };
