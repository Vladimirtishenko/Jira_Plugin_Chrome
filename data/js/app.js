const url = 'jira';

let App = (function(){

    function App(){
        this.location = window.location.host;
        this.templates = {};
    }

    App.prototype.init = function(){

        if(this.location.indexOf(url) == -1) return;
        
        chrome.runtime.sendMessage({
            type: 'makeRequest',
            method: 'GET',
            objectOfData: null,
            url: 'https://confluence.oraclecorp.com/confluence/rest/api/content/245243734?expand=space,body.view,version,container'
        }, this.responseListenersPostMessage.bind(this));

    };

     App.prototype.responseListenersPostMessage = function(response){
        
        let body = (JSON.parse(response)).body.view.value,
            hiddenElement = document.createElement('div');

        hiddenElement.innerHTML = body;

        let table = hiddenElement.querySelectorAll('table tr');

        for(element of table){
            this.templates[element.firstElementChild.innerText] = Template.rightGenerateTemplateDiscription(element.lastElementChild.children)
        }

        hiddenElement = null;

        this.addStyle();
        this.mutation();

    };

    App.prototype.addStyle = function(){

        let style = `<style>
                        .jira-hover-to-need-in-css:hover{
                            background-color: #3b73af;
                            color: #fff !important;
                        }   
                    </style>`;

         document.body.insertAdjacentHTML('afterBegin', style);

    };

    App.prototype.mutation = function(){

        this.observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if(mutation.type == 'childList' && mutation.addedNodes.length > 0){
                this.mutationResponseToCreateContextForTextarea(document.querySelectorAll('textarea'));
                this.mutationResponseToInputLength(document.querySelectorAll('input[maxlength]'));
            }
          });    
        });
         
        let config = {childList: true, subtree: true};
         
        this.observer.observe(document.body, config);
    };


    App.prototype.mutationResponseToCreateContextForTextarea = function(arrayTextarea){

        for(element of arrayTextarea){
            if(!element.classList.contains('context-menu-add-listener-true')){
                element.classList.add('context-menu-add-listener-true');
                element.addEventListener('contextmenu', this.handlerForContextMenu.bind(this))
            }
        }
    };

    App.prototype.mutationResponseToInputLength = function(input){

        for(element of input){
            element.removeAttribute('maxlength');
        }

    };

    App.prototype.handlerForContextMenu = function(event){
        event.preventDefault();

        let target = event && event.target,
            positionX = event.clientX,
            positionY = event.clientY,
            template = Template.getWindowContextMenu(positionX, positionY, this.templates),
            blockListMenu;

            document.body.insertAdjacentHTML('afterBegin', template);
            
            this.blockListMenu = document.querySelector('.window-background-full-for-context-menu');

            this.blockListMenu.addEventListener('click', this.handlerForChooseTemplate.bind(this, target));
    };

    App.prototype.handlerForChooseTemplate = function(targetParent, event){


        let target = event && event.target,
            targetAttr = target.getAttribute('data-attr-link');

        if(!targetAttr) {
            this.handlerToCloseWindowContextMenu()
            return;
        };

        let template = this.templates[targetAttr] ? this.templates[targetAttr] : null;

        if(template){
            targetParent.value = template;
        } else {
            targetParent.focus();
            document.execCommand(targetAttr);
        }

        this.handlerToCloseWindowContextMenu()

    };

    App.prototype.handlerToCloseWindowContextMenu = function(){
        this.blockListMenu.parentNode.removeChild(this.blockListMenu);
    };

    return new App;

})(url);

window.addEventListener('load', () => { App.init() });