import { axiosInstance } from '../../axios/axios';
import { IUnitTypeOption, UnitTypesApiResponse } from '../../interfaces/SelectOptions.interface';

export const unitTypesEndpoints = {
  getUnitTypes: async (): Promise<IUnitTypeOption[]> => {
    const response = await axiosInstance.get<UnitTypesApiResponse>('/products/unittype');
    
    return (response.data.data || []).map(unitType => ({
      value: String(unitType.id),
      label: unitType.unitTypeDescription,
      equivalencyValue: Number(unitType.equivalencyValue),
      isSelectCountDisabled: unitType.isSelectCountDisabled
    }));
  }
}; 