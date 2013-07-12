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

    /* Draw arrows on both sides of the feature */
    renderFeatureArrows: function( featDiv )  {

	//Create arrow divs
	var rightArrowDiv = document.createElement("div");
	var leftArrowDiv = document.createElement("div");
	
	//Add the appropriate class so css will overlay the appropriate 
	//arrowhead image (look at track_styles.css for more information)
        dojo.addClass(rightArrowDiv, "minus-transcript-arrowhead");
        dojo.addClass(leftArrowDiv, "plus-transcript-arrowhead");

	//Shift arrow positions the length of their 
	//width so they align with the feature borders
	leftArrowDiv.style.left = -this.minusArrowWidth + 'px';
	rightArrowDiv.style.right = -this.plusArrowWidth + 'px';

	//Add arrows to feature
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
