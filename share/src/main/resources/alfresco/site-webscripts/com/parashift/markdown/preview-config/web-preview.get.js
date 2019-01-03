if (model.widgets)
{
    for (var i = 0; i < model.widgets.length; i++)
    {
        var widget = model.widgets[i];

        if (widget.id == "WebPreview")
        {
            if (url.args.nodeRef) {
                nodeRef = url.args.nodeRef
                pObj = eval('(' + remote.call("/slingshot/doclib2/node/" + nodeRef.replace(":/", "")) + ')').item.node;
            } else {
                pObj = JSON.parse(remote.connect(model.proxy).get("/" + model.api + "/node/" + model.nodeRef + "/metadata"))
                nodeRef = pObj.nodeRef
                mdContent = remote.connect(model.proxy).get("/" + model.api + "/node/" + model.nodeRef + "/content")
                widget.options.content = mdContent;
            }

            if(pObj && pObj.mimetype == "text/x-markdown") {
                var conditions = [{
                    attributes: {
                        mimeType: "text/x-markdown"
                    },
                    plugins: [{
                        name: "MarkDown",
                        attributes: pObj
                    }]
                }];

                // Override the original conditions
                model.pluginConditions = conditions;
                model.nodeRef = nodeRef;
                widget.options.pluginConditions = model.pluginConditions;
            }
            widget.options.originUri = nodeRef;
        }
    }
}
