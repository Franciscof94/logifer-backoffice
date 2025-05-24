import { useQuery } from '@tanstack/react-query';
import { unitTypesEndpoints } from '../../api/endpoints/unitTypes';

export const useUnitTypes = () => {
  return useQuery({
    queryKey: ['unitTypes'],
    queryFn: async () => {
      try {
        const data = await unitTypesEndpoints.getUnitTypes();
        return data;
      } catch (error) {
        console.error('Error fetching unit types:', error);
        throw error;
      }
    }
  });
}; 