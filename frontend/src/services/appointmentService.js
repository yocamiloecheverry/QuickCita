import api from "./api";

/**
 * Crea una nueva cita.
 * @param {{ id_paciente:number, id_medico:number, fecha_hora:string, metodo_notificacion:string, seguro_medico?:string }} data
 */
export const createAppointment = async (data) => {
  const { data: cita } = await api.post("/citas/create", data);
  return cita;
};

// nuevo: obtenemos slots libres
export const getAvailableSlots = async (id_medico) => {
  const { data: slots } = await api.get(`/citas/${id_medico}/slots`);
  return slots; // array de ISO strings
};
