import api from "./api";

// Servicio para obtener los filtros de perfiles médicos
export const getPerfilFilters = async () => {
  const res = await api.get("/perfiles_medicos/filters");
  return res.data; 
  // { especialidades:[], ubicaciones:[], seguros:[] }
};
