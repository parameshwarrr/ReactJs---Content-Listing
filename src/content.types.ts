export interface ContentItemType {
	name: string;
	"poster-image": string;
}

export interface PageDataType {
	contentItems: any;
	page: {
		title: string;
		"total-content-items": string;
		"page-num-requested": string;
		"page-size-requested": string;
		"page-size-returned": string;
		"content-items": {
			content: ContentItemType[];
		};
	};
}
