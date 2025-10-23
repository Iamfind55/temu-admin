import { FilterState } from "@/types/filter";

interface IndexPaginateTypes {
  filter: FilterState;
  index: number;
}

export const calculateIndexPaginate = ({
  filter,
  index,
}: IndexPaginateTypes) => {
  const indexPageNumber =
    index + 1 + (filter?.page * filter?.offset - filter?.offset);

  return indexPageNumber;
};
