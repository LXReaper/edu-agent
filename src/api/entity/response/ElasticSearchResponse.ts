
export type ElasticSearchResponse<T> = {
    content: Array<T>;
    totalElements: number;
    totalPages: number;
    currentPage: number;
}
