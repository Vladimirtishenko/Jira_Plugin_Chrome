let Template = (function(){
	function Template(){}

	Template.prototype.getWindowContextMenu = function(x, y, template){
		
		let str = `<div style="z-index: 999999; width: 100%; height: 100%; position: fixed; overflow: hidden;" class="window-background-full-for-context-menu">
                        <div class="ajs-layer box-shadow active" id="gh-ctx-menu-trigger_drop" aria-hidden="false" style="position: absolute; left: `+x+`px; top: `+y+`px; max-height: 663px;">
                            <div id="gh-ctx-menu-content" class="aui-list">
                            	<ul class="aui-list-section aui-first">
                            		<li><a class="aui-list-item-link js-context-menu-action jira-hover-to-need-in-css" data-attr-link="copy" title="Copy" href="#">Copy</a></li>
                            		<li><a class="aui-list-item-link js-context-menu-action jira-hover-to-need-in-css" data-attr-link="cut" title="Cut" href="#">Cut</a></li>
                                	<li><a class="aui-list-item-link js-context-menu-action jira-hover-to-need-in-css" data-attr-link="paste" title="Paste" href="#">Paste</a></li>
                            	</ul>
                                <h5>Template for:</h5>
                                <ul class="aui-list-section aui-first">`;

	                                for(let keys in template){
	                                	str += `<li id="ghx-issue-ctx-action-flag-toggle-container" class="aui-list-item">
	                                        		<a class="aui-list-item-link js-context-menu-action jira-hover-to-need-in-css" data-attr-link="`+keys+`" title="`+keys+`" href="#">`+keys+`</a>
	                                    		</li>`
	                                }

            str +=  `</ul></div></div></div>`;             
        return str;
	};


	Template.prototype.rightGenerateTemplateDiscription = function(paragraph){
		let str = "";
		for(p of paragraph){
			str += (p.textContent.indexOf("*") == 0 && p.textContent.lastIndexOf("*") > -1) ? "\n" + p.textContent + "\n\n" : p.textContent + "\n";
		}
		return str;
	};

	return new Template;
})()