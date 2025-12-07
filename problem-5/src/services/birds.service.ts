import {
  listBirds,
  getBird,
  createBird,
  updateBird,
  deleteBird,
} from "../models/birds";

export const getAllBirds = ({
  species,
  name,
  habitat,
  page,
  pageSize,
}: {
  species?: string;
  name?: string;
  habitat?: string;
  page?: string;
  pageSize?: string;
}) => {
  const p = Math.max(1, Number(page || 1));
  const ps = Math.max(1, Number(pageSize || 10));

  const result = listBirds({ species, name, habitat }, p, ps);

  return result;
};

export const getBirdById = (id: number) => {
  return getBird(id);
};

export const createBirdService = ({
  name,
  species,
  habitat,
}: {
  name: string;
  species?: string | null;
  habitat?: string | null;
}) => {
  return createBird({ name, species, habitat });
};

export const updateBirdService = (
  id: number,
  data: {
    name?: string | null;
    species?: string | null;
    habitat?: string | null;
  }
) => {
  return updateBird(id, data);
};

export const deleteBirdService = (id: number) => {
  return deleteBird(id);
};
