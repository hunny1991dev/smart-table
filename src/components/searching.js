export function initSearching(searchField) {
    // Функция для формирования параметров запроса
    const applySearching = (query, state, action) => {

        if (state[searchField] && state[searchField] !== '') {

            return {
                ...query,
                search: state[searchField]
            };
        }

        return query;
    };

    return applySearching;
}