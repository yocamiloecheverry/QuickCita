import api from "./api";

export const getPerfilFilters = async () => {
  const res = await api.get("/perfiles_medicos/filters");
  return res.data; 
  // { especialidades:[], ubicaciones:[], seguros:[] }
};
