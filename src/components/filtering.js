import {createComparison, defaultRules, rules} from "../lib/compare.js";

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

        // @todo: #4.3 — настроить компаратор
        
        // Создаём кастомные правила для totalFrom и totalTo
        const customRules = [];
        
        // Правило для totalFrom (сумма >= указанного значения)
        customRules.push((key, sourceValue, targetValue, source, target) => {
            // Срабатываем только для ключа totalFrom
            if (key !== 'totalFrom') {
                return { continue: true };
            }
            
            // Если значение пустое — пропускаем это поле
            if (targetValue === undefined || targetValue === null || targetValue === '') {
                return { skip: true };
            }
            
            // Получаем сумму из исходного объекта
            const total = parseFloat(source.total);
            const minTotal = parseFloat(targetValue);
            
            // Проверяем, что сумма >= минимального значения
            if (!isNaN(total) && !isNaN(minTotal) && total >= minTotal) {
                return { result: true };
            }
            
            return { result: false };
        });
        
        // Правило для totalTo (сумма <= указанного значения)
        customRules.push((key, sourceValue, targetValue, source, target) => {
            // Срабатываем только для ключа totalTo
            if (key !== 'totalTo') {
                return { continue: true };
            }
            
            // Если значение пустое — пропускаем это поле
            if (targetValue === undefined || targetValue === null || targetValue === '') {
                return { skip: true };
            }
            
            // Получаем сумму из исходного объекта
            const total = parseFloat(source.total);
            const maxTotal = parseFloat(targetValue);
            
            // Проверяем, что сумма <= максимального значения
            if (!isNaN(total) && !isNaN(maxTotal) && total <= maxTotal) {
                return { result: true };
            }
            
            return { result: false };
        });

        // @todo: #4.5 — отфильтровать данные используя компаратор
        
        // Создаём функцию сравнения: стандартные правила + наши кастомные
        const compare = createComparison(defaultRules, customRules);
        
        return data.filter(row => compare(row, state));
    }
}