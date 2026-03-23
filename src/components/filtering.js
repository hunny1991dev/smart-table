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
        
        // Создаём копию state и преобразуем totalFrom/totalTo в массив для поля total
        const modifiedState = { ...state };
        
        // Если есть оба поля или одно из них, создаём массив [from, to]
        if (modifiedState.totalFrom !== undefined || modifiedState.totalTo !== undefined) {
            const from = modifiedState.totalFrom ? parseFloat(modifiedState.totalFrom) : undefined;
            const to = modifiedState.totalTo ? parseFloat(modifiedState.totalTo) : undefined;
            
            // Создаём массив [from, to] для поля total
            if (from !== undefined || to !== undefined) {
                modifiedState.total = [from, to];
            }
        }
        
        // Создаём кастомные правила
        const customRules = [];
        
        // Добавляем правило для проверки диапазона через arrayAsRange
        // Создаём правило, которое будет применяться к полю total
        customRules.push((key, sourceValue, targetValue, source, target) => {
            // Нас интересует только поле total
            if (key !== 'total') {
                return { continue: true };
            }
            
            // Если targetValue не массив, пропускаем
            if (!Array.isArray(targetValue)) {
                return { continue: true };
            }
            
            // Используем встроенное правило arrayAsRange
            const rangeRule = rules.arrayAsRange();
            return rangeRule(key, sourceValue, targetValue, source, target);
        });

        // @todo: #4.5 — отфильтровать данные используя компаратор
        
        // Создаём функцию сравнения с модифицированным state
        const compare = createComparison(defaultRules, customRules);
        
        return data.filter(row => compare(row, modifiedState));
    }
}