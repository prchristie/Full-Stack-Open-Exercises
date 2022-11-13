import axios from "axios";

const baseUrl = "/api/persons";

const create = (person) => axios.post(baseUrl, person).then((res) => res.data);

const getAll = () => axios.get(baseUrl).then((res) => res.data);

const deletePhoneBookEntry = (id) =>
  axios.delete(`${baseUrl}/${id}`).then((res) => res.data);

const update = (id, newPerson) =>
  axios.put(`${baseUrl}/${id}`, newPerson).then((r) => r.data);

export default { create, getAll, deletePhoneBookEntry, update };
