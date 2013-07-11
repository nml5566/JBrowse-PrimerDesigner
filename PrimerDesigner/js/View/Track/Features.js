define( "PrimerDesigner/View/Track/Features", [
            'dojo/_base/declare',
            'JBrowse/View/Track/HTMLFeatures'
        ],
      function( declare,
                HTMLFeatures
              ) {

var PrimerFeatures = declare( [ HTMLFeatures ], {

    /* Subclassed to prevent arrow movement */
    updateStaticElements: function( coords ) { /* NML: necessary */
        this.inherited( arguments );
        this.updateFeatureLabelPositions( coords );
    },

    /*  Subclassed to add arrows to feature */
   addFeatureToBlock: function( 
	feature, uniqueId, block, scale, labelScale, descriptionScale,
	containerStart, containerEnd ) { 

	var featDiv = this.renderFeature( 
	    feature, uniqueId, block, scale, labelScale, descriptionScale,
	    containerStart, containerEnd );

	if( ! featDiv )
	    return null;

	this.renderFeatureArrows( featDiv );

	block.domNode.appendChild( featDiv );
	if( this.config.style.centerChildrenVertically )
	    this._centerChildrenVertically( featDiv );
	return featDiv;
    },

    // Draw the arrows on either side of the feature
    renderFeatureArrows: function( featDiv )  {

	var rightArrowDiv = document.createElement("div");
        dojo.addClass(rightArrowDiv, "minus-transcript-arrowhead");

	var leftArrowDiv = document.createElement("div");
        dojo.addClass(leftArrowDiv, "plus-transcript-arrowhead");

	var viewmin = this.browser.view.minVisible();
	var viewmax = this.browser.view.maxVisible();

	leftArrowDiv.style.left = -this.minusArrowWidth + 'px';
	rightArrowDiv.style.right = -this.plusArrowWidth + 'px';

        featDiv.appendChild(leftArrowDiv);
        featDiv.appendChild(rightArrowDiv);
    },

    /* Subclass to remove the "Save track" option */
   _trackMenuOptions: function() {
	var o = this.inherited(arguments);
	o.splice(3,1); 
	return o;
    }

});

return PrimerFeatures;
});

/*

Created by Nathan Liles <nml5566@gmail.com>
Subclassed from JBrowse/View/Track/HTMLFeatures

*/
