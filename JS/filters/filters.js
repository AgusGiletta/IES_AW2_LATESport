import { mostrarMensaje } from '../utils.js'; 

document.addEventListener('DOMContentLoaded', () => {
    const filterSidebar = document.querySelector('.filter-sidebar');
    const productContainer = document.getElementById('productContainer');
    const btnApply = document.querySelector('[id^="btnApplyFilters"]');    
    const btnClear = document.querySelector('[id^="btnClearFilters"]');
    const noProductsMessage = document.getElementById('noProductsMessage');
    
    if (!filterSidebar || !productContainer || !noProductsMessage) {
        console.error("No se encontraron elementos clave de filtros, contenedor de productos o el mensaje de error fijo.");
        return;
    }

    const applyFilters = () => {
        const selectedFilters = {};
        let totalActiveFilters = 0;

        noProductsMessage.classList.add('d-none');

        filterSidebar.querySelectorAll('[data-filter-group]').forEach(group => {
            const groupName = group.getAttribute('data-filter-group');
            const activeValues = Array.from(group.querySelectorAll('input[type="checkbox"]:checked'))
                                           .map(input => input.value);
            
            if (activeValues.length > 0) {
                selectedFilters[groupName] = activeValues;
                totalActiveFilters += activeValues.length;
            }
        });

        const products = Array.from(productContainer.children);

        if (totalActiveFilters === 0) {
            clearFilters(false); 
            mostrarMensaje('No se seleccionaron filtros. Mostrando todos los productos.', 'info');
            return;
        }

        let productsFound = false;

        products.forEach(product => {
            let isVisible = true;

            for (const groupName in selectedFilters) {
                const requiredValues = selectedFilters[groupName]; 
                
                const productValuesString = product.getAttribute(`data-${groupName}`) || '';
                const productValues = productValuesString.split(',').map(v => v.trim());

                const matchFound = requiredValues.some(requiredValue => 
                    productValues.includes(requiredValue)
                );
                
                if (!matchFound) {
                    isVisible = false;
                    break;
                }
            }

            product.classList.toggle('d-none', !isVisible);

            if (isVisible) {
                productsFound = true;
            }
        });
        
        if (!productsFound) {
            noProductsMessage.classList.remove('d-none');
            mostrarMensaje('Filtros aplicados, pero no se encontraron coincidencias.', 'warning');
        } else {
            noProductsMessage.classList.add('d-none');
            mostrarMensaje('Filtros aplicados con éxito.', 'success');
        }
    };
    
    const clearFilters = (showToast = true) => {
        filterSidebar.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
            checkbox.checked = false;
        });

        productContainer.querySelectorAll('.col').forEach(product => {
            product.classList.remove('d-none');
        });
        
        noProductsMessage.classList.add('d-none');

        if (showToast) {
            mostrarMensaje('Filtros limpiados. Mostrando todos los productos.', 'info');
        }
    };

   if (btnApply) {
        btnApply.addEventListener('click', applyFilters);
    }

    if (btnClear) {
        btnClear.addEventListener('click', () => clearFilters(true)); 
    }
});