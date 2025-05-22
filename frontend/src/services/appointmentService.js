import api from "./api";

/**
 * Crea una nueva cita.
 * @param {{ id_paciente:number, id_medico:number, fecha_hora:string, metodo_notificacion:string, seguro_medico?:string }} data
 */
export const createAppointment = async (data) => {
  const response = await api.post("/citas/create", data);
  return response.data;
};
