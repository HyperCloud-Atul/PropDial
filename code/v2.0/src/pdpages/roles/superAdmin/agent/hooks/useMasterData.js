import { useCollection } from "../../../../../hooks/useCollection";

export const useMasterData = () => {
  const { documents: masterState, error: masterStateError } = useCollection("m_states", "", ["state", "asc"]);
  const { documents: masterCity, error: masterCityError } = useCollection("m_cities", "", ["city", "asc"]);
  const { documents: masterLocality, error: masterLocalityError } = useCollection("m_localities", "", ["locality", "asc"]);
  const { documents: masterSociety, error: masterSocietyError } = useCollection("m_societies", "", ["society", "asc"]);

  const masterDataLoading = !masterState || !masterCity || !masterLocality || !masterSociety;

  return {
    masterData: {
      masterState,
      masterCity,
      masterLocality,
      masterSociety,
    },
    masterDataLoading,
    errors: {
      masterStateError,
      masterCityError,
      masterLocalityError,
      masterSocietyError,
    }
  };
};