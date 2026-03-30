import {getPages} from "../lib/utils.js";

export function initPagination({pages, fromRow, toRow, totalRows}, createPage) {
    let pageCount;
    
    const pageTemplate = pages.firstElementChild.cloneNode(true);
    pages.firstElementChild.remove();
    
    // Функция для формирования параметров запроса (вызывается ДО получения данных)
    const applyPagination = (query, state, action) => {
        const limit = state.rowsPerPage;
        let page = state.page;
        
        if (action) {
            switch(action.name) {
                case 'prev':
                    page = Math.max(1, page - 1);
                    break;
                case 'next':
                    page = Math.min(pageCount || 1, page + 1);
                    break;
                case 'first':
                    page = 1;
                    break;
                case 'last':
                    page = pageCount || 1;
                    break;
            }
        }
        
        return {
            ...query,
            limit,
            page
        };
    }
    
    // Функция для обновления визуального состояния пагинатора
    const updatePagination = (total, { page, limit }) => {

        pageCount = Math.ceil(total / limit);
        
        const visiblePages = getPages(page, pageCount, 5);
        pages.replaceChildren(...visiblePages.map(pageNumber => {
            const el = pageTemplate.cloneNode(true);
            return createPage(el, pageNumber, pageNumber === page);
        }));
        
        const skip = (page - 1) * limit;
        fromRow.textContent = skip + 1;
        toRow.textContent = Math.min(page * limit, total);
        totalRows.textContent = total;
    }
    
    return {
        applyPagination,
        updatePagination
    };
}