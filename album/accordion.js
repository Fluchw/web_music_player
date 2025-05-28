// accordion.js
const AccordionModule = (function() {
    let config = {};
    let switchToNextViewCallback = null;
    let switchToPrevViewCallback = null;
    
    function setActivePanel(index) {
        if (index < 0 || index >= config.panels.length || !config.panels[index]) return;
        config.panels.forEach(p => p.classList.remove('active'));
        config.panels[index].classList.add('active');
        config.currentActiveIndex = index;
    }

    function setup() {
        if (!config.containerElement) { 
            console.error('新版手风琴容器元素未找到 (accordion.js)!');
            return; 
        }
        config.panels = []; 
        config.containerElement.innerHTML = ''; 

        config.data.forEach((dataItem, index) => {
            const panel = document.createElement('div');
            panel.classList.add('accordion-panel-new'); 
            panel.style.backgroundImage = `url('${dataItem.imageUrl}')`;

            const titleElement = document.createElement('div');
            titleElement.classList.add('panel-title-new'); 
            titleElement.textContent = dataItem.title;
            
            panel.appendChild(titleElement);
            config.containerElement.appendChild(panel);
            config.panels.push(panel);

            panel.addEventListener('click', () => { 
                setActivePanel(index); 
            });
        });
        if (config.panels.length > 0) {
            setActivePanel(config.currentActiveIndex || 0); 
        }
    }

    function handleWheel(event) {
        let nextIndex = config.currentActiveIndex;
        if (event.deltaY > 0) { 
            if (config.currentActiveIndex < config.data.length - 1) {
                nextIndex++;
            } else {
                if (typeof switchToNextViewCallback === 'function') switchToNextViewCallback(); 
                return true; 
            }
        } else if (event.deltaY < 0) { 
            if (config.currentActiveIndex > 0) {
                nextIndex--;
            } else {
                if (typeof switchToPrevViewCallback === 'function') switchToPrevViewCallback(); 
                return true; 
            }
        }
        if (nextIndex !== config.currentActiveIndex) {
            setActivePanel(nextIndex);
        }
        return true; 
    }
    return {
        init: function(initialConfig, callbackToNext, callbackToPrev) { 
             config = { 
                data: [], 
                containerElement: null, 
                panels: [], 
                currentActiveIndex: 0, 
                ...initialConfig 
            };
            switchToNextViewCallback = callbackToNext;
            switchToPrevViewCallback = callbackToPrev;
            setup();
        },
        handleWheel: handleWheel,
        getConfig: function() { return config; } 
    };
})();
