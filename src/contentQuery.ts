import { useInfiniteQuery } from "@tanstack/react-query";

import type { PageDataType } from "./content.types";

const fetchPage = async (pageNumber: number): Promise<PageDataType> => {
	const response = await fetch(`https://test.create.diagnal.com/data/page${pageNumber}.json`);

	const data: PageDataType = await response.json();
	return data;
};

export const useContentQuery = () => {
	return useInfiniteQuery({
		queryKey: ["content"],
		queryFn: ({ pageParam }) => fetchPage(pageParam),
		initialPageParam: 1,
		getNextPageParam: (_lastPage, _pages, lastPageParam) => {
			const nextPage = lastPageParam + 1;
			return nextPage < 4 ? nextPage : undefined;
		},
		// maxPages: 4,
	});
};
