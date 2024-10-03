import { useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

import { useContentQuery } from "../contentQuery";

import { ContentItem } from "./ContentItem";
import { PlaceholderItem } from "./PlaceholderItem";

const ITEMS_PER_ROW = 3;

export const ContentGrid = () => {
	const [showSearchBar, setShowSearchBar] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	const [showTitle, setShowTitle] = useState(true);

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useContentQuery();

	const allItems = data?.pages.flatMap((page) => page.page["content-items"].content) ?? [];

	const totalItems = data?.pages.reduce((acc, page) => acc + parseInt(page.page["page-size-returned"]), 0) ?? 0;

	const parentRef = useRef<HTMLDivElement>(null);

	const filteredItems = allItems.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
	const totalFilteredItems = filteredItems.length;

	const rowVirtualizer = useVirtualizer({
		count: Math.ceil(totalFilteredItems / ITEMS_PER_ROW),
		getScrollElement: () => scrollContainerRef.current,
		estimateSize: () => 220,
		overscan: 2,
	});

	const columnVirtualizer = useVirtualizer({
		horizontal: true,
		count: ITEMS_PER_ROW,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 130,
		overscan: 3,
	});

	const rowItems = rowVirtualizer.getVirtualItems();

	useEffect(() => {
		const handleScroll = () => {
			if (scrollContainerRef.current) {
				const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
				if (scrollTop + clientHeight >= scrollHeight && hasNextPage && !isFetchingNextPage) {
					fetchNextPage();
				}
			}
		};

		const container = scrollContainerRef.current;
		if (container) {
			container.addEventListener("scroll", handleScroll);
		}

		return () => {
			if (container) {
				container.removeEventListener("scroll", handleScroll);
			}
		};
	}, [fetchNextPage, hasNextPage, isFetchingNextPage]);

	useEffect(() => {
		const [lastItem] = [...rowItems].reverse();

		if (!lastItem) {
			return;
		}

		if (lastItem.index >= totalFilteredItems / ITEMS_PER_ROW - 1 && hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	}, [hasNextPage, fetchNextPage, totalFilteredItems, isFetchingNextPage, totalItems, rowItems]);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	const handleSearchIconClick = () => {
		setShowSearchBar(true);
		setShowTitle(false);
	};

	const handleCloseSearch = () => {
		setShowSearchBar(false);
		setShowTitle(true);
		setSearchQuery("");
	};
	const handleSearch = (query: string) => {
		setSearchQuery(query);
		rowVirtualizer.scrollToIndex(0);
	};

	const titles = data?.pages.map((page) => page.page.title) || ["Default Title"];

	return (
		<div ref={parentRef} className="relative h-screen overflow-auto p-2">
			<div
				className="sticky left-0 right-0 top-0 z-10 flex h-14 items-center justify-between bg-cover bg-no-repeat"
				style={{ backgroundImage: "url(https://test.create.diagnal.com/images/nav_bar.png)" }}
			>
				<img src="https://test.create.diagnal.com/images/Back.png" alt="Back" className="ml-4 h-8 w-8 cursor-pointer" />
				{showTitle && (
					<h1 className="ml-4 flex-grow text-left text-2xl font-bold" style={{ fontFamily: "Titillium Web" }}>
						{titles[0]}
					</h1>
				)}
				<div className="relative">
					{!showSearchBar ? (
						<img
							src="https://test.create.diagnal.com/images/search.png"
							alt="Search"
							className="h-8 w-8 cursor-pointer"
							onClick={handleSearchIconClick}
						/>
					) : (
						<div className="flex items-center">
							<input
								type="text"
								value={searchQuery}
								onChange={(e) => handleSearch(e.target.value)}
								className="rounded border bg-white p-2 text-black"
								placeholder="Search content..."
							/>
							<button onClick={handleCloseSearch} className="ml-2">
								Close
							</button>
						</div>
					)}
				</div>
			</div>
			<div
				ref={scrollContainerRef}
				style={{
					height: "calc(100% - 56px)",
					overflowY: "auto",
					width: "100%",
					position: "relative",
				}}
			>
				{rowVirtualizer.getVirtualItems().map((virtualRow) => (
					<div
						key={virtualRow.index}
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							width: "100%",
							height: `${virtualRow.size}px`,
							transform: `translateY(${virtualRow.start}px)`,
							display: "flex",
							padding: "8px",
							boxSizing: "border-box",
						}}
					>
						{columnVirtualizer.getVirtualItems().map((virtualCol) => {
							const index = virtualRow.index * ITEMS_PER_ROW + virtualCol.index;
							const item = filteredItems[index];
							return (
								<div
									key={virtualCol.index}
									style={{
										flex: 1,
										height: "100%",
										padding: "8px",
										visibility: item && item.name ? "visible" : "hidden",
									}}
								>
									{item ? <ContentItem item={item} /> : <PlaceholderItem />}
								</div>
							);
						})}
					</div>
				))}
			</div>
			{totalFilteredItems === 0 && <div>No results found.</div>}
		</div>
	);
};
