export function initFiltering(elements) {
    // Функция для заполнения выпадающих списков опциями (вызывается ПОСЛЕ получения индексов)
    const updateIndexes = (elements, indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            const select = elements[elementName];
            if (select) {
                const firstOption = select.options[0];
                select.innerHTML = '';
                if (firstOption && firstOption.value === '') {
                    select.appendChild(firstOption);
                }
            }
            
            Object.values(indexes[elementName]).forEach(name => {
                const el = document.createElement('option');
                el.textContent = name;
                el.value = name;
                elements[elementName].appendChild(el);
            });
        });
    };

    // Функция для формирования параметров запроса
    const applyFiltering = (query, state, action) => {

        if (action && action.name === 'clear') {
            const parent = action.closest('.filter-group');
            const input = parent.querySelector('input, select');
            if (input) {
                input.value = '';
                const fieldName = action.dataset.field;
                if (fieldName) {

                    delete state[fieldName];
                }
            }
        }
        
        const filter = {};
        
        Object.keys(elements).forEach(key => {
            const element = elements[key];
            if (element) {
                const tagName = element.tagName;
                const value = element.value;
                
                if (['INPUT', 'SELECT'].includes(tagName) && value && value !== '') {
                    filter[`filter[${element.name}]`] = value;
                }
            }
        });
        
        return Object.keys(filter).length ? { ...query, ...filter } : query;
    };

    return {
        updateIndexes,
        applyFiltering
    };
}