(function() {

    Alfresco.WebPreview.prototype.Plugins.MarkDown = function(wp, attributes)
    {
        this.wp = wp;
    if (!attributes.node) {
        attributes.node = {contentURL: "/slingshot/node/content/" + wp.options.originUri.replace(":/", "") + "/" + wp.options.name}
        attributes.content = wp.options.content
    }
        this.attributes = YAHOO.lang.merge(Alfresco.util.deepCopy(this.attributes), attributes);
        return this;
    };

    Alfresco.WebPreview.prototype.Plugins.MarkDown.prototype =
    {
        attributes: {},

        report: function() {
            return null;
        },

        display: function() {

            var node = this.attributes.node;
            var content = this.attributes.content;

            //get the Div Element we'll be putting the Markdown
            var divElem = document.getElementById(this.wp.id + "-body")



            //Execute Ajax request for content
            require(["dojo/request", "showdown"], function(request, showdown){

                //Once we have the content, let's create a converter and add the html to the div element
                converter = new showdown.Converter({
                    extensions: [
                        function() {
                            return [{
                                type: 'output',
                                filter: function(source) {
                                    return source.replace(/<img src="([^"]*)"/g, function(match, src) {
                                        if(src.startsWith("http")) {
                                            return match;
                                        }
                                    });
                                }
                            }]
                        }
                    ]

                });
                request.get(Alfresco.constants.PROXY_URI_RELATIVE + node.contentURL).then(function(mdData) {
                    newHtml = converter.makeHtml(mdData);
                    divElem.innerHTML = newHtml;

                }, function(error) {
                    newHtml = converter.makeHtml(content);
                    divElem.innerHTML = newHtml;
        });
                    divElem.className = "markdown-body";

            });

        }
    }

})();
