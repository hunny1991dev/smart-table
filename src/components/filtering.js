import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes).forEach((elementName) => {
        elements[elementName].append(
            ...Object.values(indexes[elementName]).map(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                return option;
            })
        )
    });

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        if (action && action.name === 'clear') {
            const parent = action.closest('.filter-group');
            const input = parent.querySelector('input, select');
            if (input) {
                input.value = '';
                const fieldName = action.dataset.field;
                if (fieldName && state[fieldName] !== undefined) {
                    state[fieldName] = '';
                }
            }
        }

        // @todo: #4.5 — отфильтровать данные используя компаратор
        
        // Создаём пользовательские правила для фильтрации по сумме
        const customRules = [];
        
        // Правило для totalFrom (сумма >= указанного значения)
        if (state.totalFrom && state.totalFrom !== '') {
            customRules.push((row, filterState) => {
                const total = parseFloat(row.total);
                const minTotal = parseFloat(filterState.totalFrom);
                return !isNaN(total) && !isNaN(minTotal) && total >= minTotal;
            });
        }
        
        // Правило для totalTo (сумма <= указанного значения)
        if (state.totalTo && state.totalTo !== '') {
            customRules.push((row, filterState) => {
                const total = parseFloat(row.total);
                const maxTotal = parseFloat(filterState.totalTo);
                return !isNaN(total) && !isNaN(maxTotal) && total <= maxTotal;
            });
        }
        
        // Создаём функцию сравнения: стандартные правила + наши пользовательские
        const compare = createComparison(defaultRules, customRules);
        
        // Фильтруем данные
        return data.filter(row => compare(row, state));
    }
}