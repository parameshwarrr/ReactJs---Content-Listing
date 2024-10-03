import type { ContentItemType } from "../content.types";

export const ContentItem = ({ item }: { item: ContentItemType }) => {
	const placeholderImage = "https://test.create.diagnal.com/images/placeholder_for_missing_posters.png";

	return (
		<div className="flex flex-col">
			<img
				src={`https://test.create.diagnal.com/images/${item["poster-image"]}`}
				alt={item.name}
				className="aspect-[2/3] w-full object-cover"
				onError={(e) => (e.currentTarget.src = placeholderImage)}
			/>
			<p
				className="mt-1 break-words text-center text-sm leading-tight"
				title={item.name}
				style={{
					wordBreak: "break-word",
					overflowWrap: "break-word",
				}}
			>
				{item.name}
			</p>
		</div>
	);
};
