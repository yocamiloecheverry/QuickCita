import api from "./api";

/**
 * Busca médicos por especialidad, ubicación o seguro médico.
 * @param {{ especialidad?:string, ubicacion?:string, seguro_medico?:string }} filters
 */
export const searchDoctors = async (filters) => {
  const params = new URLSearchParams();
  if (filters.especialidad) params.append("especialidad", filters.especialidad);
  if (filters.ubicacion)    params.append("ubicacion", filters.ubicacion);
  if (filters.seguro_medico) params.append("seguro_medico", filters.seguro_medico);

  const response = await api.get(`/usuarios/medicos?${params.toString()}`);
  return response.data; // deberá devolver un array de médicos con su perfil
};
