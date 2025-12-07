import * as BirdModel from "../models/birds";

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

  const result = BirdModel.listBirds({ species, name, habitat }, p, ps);

  return result;
};

export const getBirdById = (id: number) => {
  return BirdModel.getBird(id);
};

export const createBird = ({
  name,
  species,
  habitat,
}: {
  name: string;
  species?: string | null;
  habitat?: string | null;
}) => {
  return BirdModel.createBird({ name, species, habitat });
};

export const updateBird = (
  id: number,
  data: {
    name?: string | null;
    species?: string | null;
    habitat?: string | null;
  }
) => {
  return BirdModel.updateBird(id, data);
};

export const deleteBird = (id: number) => {
  return BirdModel.deleteBird(id);
};
