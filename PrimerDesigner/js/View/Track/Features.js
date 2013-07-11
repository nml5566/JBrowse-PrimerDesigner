//define( "JBrowse/View/Track/PrimerFeatures", [
define( "PrimerDesigner/View/Track/Features", [
            'dojo/_base/declare',
            'dojo/_base/lang',
            'dojo/_base/array',
            'dojo/dom-construct',
            'dojo/dom-geometry',
            'dojo/on',
            'JBrowse/has',
            'dijit/Dialog',
            'dijit/form/Select',
            'dijit/form/RadioButton',
            'dijit/form/Button',
            'JBrowse/View/Track/BlockBased',
            'JBrowse/View/Track/YScaleMixin',
            'JBrowse/View/Track/ExportMixin',
            'JBrowse/View/Track/FeatureDetailMixin',
            'JBrowse/Util',
            'JBrowse/View/GranularRectLayout',
            'JBrowse/Model/Location'
        ],
      function( declare,
                lang,
                array,
                dom,
                domGeom,
                on,
                has,
                dijitDialog,
                dijitSelect,
                dijitRadioButton,
                dijitButton,
                BlockBased,
                YScaleMixin,
                ExportMixin,
                FeatureDetailMixin,
                Util,
                Layout,
                Location
              ) {

var PrimerFeatures = declare( [ BlockBased, YScaleMixin, ExportMixin, FeatureDetailMixin ], {
    /**
     * A track that draws discrete features using `div` elements.
     * @constructs
     * @extends JBrowse.View.Track.BlockBased
     * @param args.config {Object} track configuration. Must include key, label
     * @param args.refSeq {Object} reference sequence object with name, start,
     *   and end members.
     * @param args.changeCallback {Function} optional callback for
     *   when the track's data is loaded and ready
     * @param args.trackPadding {Number} distance in px between tracks
     */
    constructor: function( args ) { /*NML: necessary*/
        //number of histogram bins per block
        this.numBins = 25;
        this.histLabel = false;

        this.defaultPadding = 5;
        this.padding = this.defaultPadding;

        this.glyphHeightPad = 1;
        this.levelHeightPad = 2;
        this.labelPad = 1;

        // if calculated feature % width would be less than minFeatWidth, then set width to minFeatWidth instead
        this.minFeatWidth = 1;

        this.trackPadding = args.trackPadding;

        this.heightCache = {}; // cache for the heights of some
                               // feature elements, indexed by the
                               // complete cassName of the feature

        this.showLabels = this.config.style.showLabels;

        this._setupEventHandlers();
    },

    /**
     * Returns object holding the default configuration for HTML-based feature tracks.
     * @private
     */
    _defaultConfig: function() { /* NML: necessary */
        return {
            maxFeatureScreenDensity: 0.5,

            // maximum height of the track, in pixels
            maxHeight: 1000,

            style: {
                arrowheadClass: 'transcript-arrowhead',

		className: "primerfeature",
                //className: "feature2",

                // not configured by users
                _defaultHistScale: 4,
                _defaultLabelScale: 30,
                _defaultDescriptionScale: 120,

                minSubfeatureWidth: 6,
                maxDescriptionLength: 70,
                showLabels: true ,
		label: function(feature) { 
		    return 'PCR primer set '+feature.get('id')
		    +' <span style="color:blue">(click for report)</span>';
		},

                centerChildrenVertically: true  // by default use feature child centering
            },
            hooks: {
                create: function(track, feat ) {
                    return document.createElement('div');
                }
            },
            events: {}
        };
    },

    endZoom: function(destScale, destBlockBases) { /* NML: necessary */
        this.clear();
    },

    updateStaticElements: function( coords ) { /* NML: necessary */
        this.inherited( arguments );
        this.updateFeatureLabelPositions( coords );
    },

    updateFeatureLabelPositions: function( coords ) { /* NML: necessary */
        if( ! 'x' in coords )
            return;

        array.forEach( this.blocks, function( block, blockIndex ) {


            // calculate the view left coord relative to the
            // block left coord in units of pct of the block
            // width
            if( ! block || ! this.label )
                return;
            var viewLeft = 100 * ( (this.label.offsetLeft+this.label.offsetWidth) - block.domNode.offsetLeft ) / block.domNode.offsetWidth + 2;

            // if the view start is unknown, or is to the
            // left of this block, we don't have to worry
            // about adjusting the feature labels
            if( ! viewLeft )
                return;

            var blockWidth = block.endBase - block.startBase;

            dojo.query( '.feature', block.domNode )
                .forEach( function(featDiv) {
                              if( ! featDiv.label ) return;
                              var labelDiv = featDiv.label;
                              var feature = featDiv.feature;

                              // get the feature start and end in terms of block width pct
                              var minLeft = parseInt( feature.get('start') );
                              minLeft = 100 * (minLeft - block.startBase) / blockWidth;
                              var maxLeft = parseInt( feature.get('end') );
                              maxLeft = 100 * ( (maxLeft - block.startBase) / blockWidth
                                                - labelDiv.offsetWidth / block.domNode.offsetWidth
                                              );

                              // move our label div to the view start if the start is between the feature start and end
                              labelDiv.style.left = Math.max( minLeft, Math.min( viewLeft, maxLeft ) ) + '%';

                          },this);
        },this);
    },

   fillBlock: function( args ) { /* NML: necessary */
	var blockIndex = args.blockIndex;
	var block = args.block;
	var leftBase = args.leftBase;
	var rightBase = args.rightBase;
	var scale = args.scale;
	var containerStart = args.containerStart;
	var containerEnd = args.containerEnd;

	var region = { ref: this.refSeq.name, start: leftBase, end: rightBase };

	this.store.getGlobalStats(
	    dojo.hitch( this, function( stats ) {

		var density        = stats.featureDensity;
		var histScale      = this.config.style.histScale    || density * this.config.style._defaultHistScale;
		var featureScale   = this.config.style.featureScale || density / this.config.maxFeatureScreenDensity; // (feat/bp) / ( feat/px ) = px/bp )

		// only update the label once for each block size
		var blockBases = Math.abs( leftBase-rightBase );
		if( this._updatedLabelForBlockSize != blockBases ){
		    if ( this.store.getRegionFeatureDensities && scale < histScale ) {
			this.setLabel(this.key + ' <span class="feature-density">per ' + Util.addCommas( Math.round( blockBases / this.numBins)) + ' bp</span>');
		    } else {
			this.setLabel(this.key);
		    }
		    this._updatedLabelForBlockSize = blockBases;
		}

		// if we our store offers density histograms, and we are zoomed out far enough, draw them
		if( this.store.getRegionFeatureDensities && scale < histScale ) {
		    this.fillHist( args );
		}
		// if we have no histograms, check the predicted density of
		// features on the screen, and display a message if it's
		// bigger than maxFeatureScreenDensity
		else if( scale < featureScale ) {
		    this.fillTooManyFeaturesMessage(
			blockIndex,
			block,
			scale
		    );
		    args.finishCallback();
		}
		else {
		    // if we have transitioned to viewing features, delete the
		    // y-scale used for the histograms
		    //this._removeYScale();
		    this.fillFeatures( dojo.mixin( {stats: stats}, args ) );
		}
	}),
	dojo.hitch( this, 'fillBlockError', blockIndex, block )
	);
    },

    destroy: function() {
        this._clearLayout();
        this.inherited(arguments);
    },

    /**
     * arguments:
     * @param args.block div to be filled with info
     * @param args.leftBlock div to the left of the block to be filled
     * @param args.rightBlock div to the right of the block to be filled
     * @param args.leftBase starting base of the block
     * @param args.rightBase ending base of the block
     * @param args.scale pixels per base at the current zoom level
     * @param args.containerStart don't make HTML elements extend further left than this
     * @param args.containerEnd don't make HTML elements extend further right than this. 0-based.
     */
    fillFeatures: function(args) { /* NML: necessary */
        var blockIndex = args.blockIndex;
        var block = args.block;
        var leftBase = args.leftBase;
        var rightBase = args.rightBase;
        var scale = args.scale;
        var stats = args.stats;
        var containerStart = args.containerStart;
        var containerEnd = args.containerEnd;
        var finishCallback = args.finishCallback;

        this.scale = scale;

        block.featureNodes = {};

        //determine the glyph height, arrowhead width, label text dimensions, etc.
        if( !this.haveMeasurements ) {
            this.measureStyles();
            this.haveMeasurements = true;
        }

        var labelScale       = 0;
        var descriptionScale = this.config.style.descriptionScale || stats.featureDensity * this.config.style._defaultDescriptionScale;

        var curTrack = this;

        var featCallback = dojo.hitch(this,function( feature ) {
            var uniqueId = feature.id();
            if( ! this._featureIsRendered( uniqueId ) ) {
                /* feature render, adding to block, centering refactored into addFeatureToBlock() */
                this.addFeatureToBlock( feature, uniqueId, block, scale, labelScale, descriptionScale,
                                        containerStart, containerEnd );
            }
        });

        this.store.getFeatures( { ref: this.refSeq.name,
                                  start: leftBase,
                                  end: rightBase
                                },
                                featCallback,
                                function () {
                                    curTrack.heightUpdate(curTrack._getLayout(scale).getTotalHeight(),
                                                          blockIndex);
                                    finishCallback();
                                },
                                function( error ) {
                                    console.error( error, error.stack );
                                    curTrack.fillBlockError( blockIndex, block, error );
                                    finishCallback();
                                }
                              );
    },

    /**
     *  Creates feature div, adds to block, and centers subfeatures.
     *  Overridable by subclasses that need more control over the substructure.
     */
    addFeatureToBlock: function( feature, uniqueId, block, scale, labelScale, descriptionScale,
                                 containerStart, containerEnd ) { /* NML: necessary */
        var featDiv = this.renderFeature( feature, uniqueId, block, scale, labelScale, descriptionScale,
                                          containerStart, containerEnd );
        if( ! featDiv )
            return null;

        block.domNode.appendChild( featDiv );
        if( this.config.style.centerChildrenVertically )
            this._centerChildrenVertically( featDiv );
        return featDiv;
    },


    fillBlockTimeout: function( blockIndex, block ) { /* NML: necessary */
        this.inherited( arguments );
        block.featureNodes = {};
    },


    /**
     * Returns true if a feature is visible and rendered someplace in the blocks of this track.
     * @private
     */
    _featureIsRendered: function( uniqueId ) { /* NML: necessary */
        var blocks = this.blocks;
        for( var i=0; i<blocks.length; i++ ) {
            if( blocks[i] && blocks[i].featureNodes && blocks[i].featureNodes[uniqueId])
                return true;
        }
        return false;
    },

    measureStyles: function() {
        //determine dimensions of labels (height, per-character width)
        var heightTest = document.createElement("div");
        heightTest.className = "feature-label";
        heightTest.style.height = "auto";
        heightTest.style.visibility = "hidden";
        heightTest.appendChild(document.createTextNode("1234567890"));
        document.body.appendChild(heightTest);
        this.labelHeight = heightTest.clientHeight;
        this.labelWidth = heightTest.clientWidth / 10;
        document.body.removeChild(heightTest);

        //measure the height of glyphs
        var glyphBox;
        heightTest = document.createElement("div");
        //cover all the bases: stranded or not, phase or not
        heightTest.className =
            "feature " + this.config.style.className
            + " plus-" + this.config.style.className
            + " plus-" + this.config.style.className + "1";
        if (this.config.style.featureCss)
            heightTest.style.cssText = this.config.style.featureCss;
        heightTest.style.visibility = "hidden";
        if (Util.is_ie6) heightTest.appendChild(document.createComment("foo"));
        document.body.appendChild(heightTest);
        glyphBox = domGeom.getMarginBox(heightTest);
        this.glyphHeight = Math.round(glyphBox.h);
        this.padding = this.defaultPadding + glyphBox.w;
        document.body.removeChild(heightTest);

        //determine the width of the arrowhead, if any
        if (this.config.style.arrowheadClass) {
            var ah = document.createElement("div");
            ah.className = "plus-" + this.config.style.arrowheadClass;
            if (Util.is_ie6) ah.appendChild(document.createComment("foo"));
            document.body.appendChild(ah);
            glyphBox = domGeom.position(ah);
            this.plusArrowWidth = glyphBox.w;
            this.plusArrowHeight = glyphBox.h;
            ah.className = "minus-" + this.config.style.arrowheadClass;
            glyphBox = domGeom.position(ah);
            this.minusArrowWidth = glyphBox.w;
            this.minusArrowHeight = glyphBox.h;
            document.body.removeChild(ah);
        }
    },

    renderFeature: function( feature, uniqueId, block, scale, labelScale, descriptionScale, containerStart, containerEnd ) { /* NML: necessary */
        //featureStart and featureEnd indicate how far left or right
        //the feature extends in bp space, including labels
        //and arrowheads if applicable

        var featureEnd = feature.get('end');
        var featureStart = feature.get('start');
        if( typeof featureEnd == 'string' )
            featureEnd = parseInt(featureEnd);
        if( typeof featureStart == 'string' )
            featureStart = parseInt(featureStart);
        // layoutStart: start genome coord (at current scale) of horizontal space need to render feature,
        //       including decorations (arrowhead, label, etc) and padding
        var layoutStart = featureStart;
        // layoutEnd: end genome coord (at current scale) of horizontal space need to render feature,
        //       including decorations (arrowhead, label, etc) and padding
        var layoutEnd = featureEnd;

        //     JBrowse now draws arrowheads within feature genome coord bounds
        //     For WebApollo we're keeping arrow outside of feature genome coord bounds,
        //           because otherwise arrow can obscure edge-matching, CDS/UTR transitions, small inton/exons, etc.
        //     Would like to implement arrowhead change in WebApollo plugin, but would need to refactor HTMLFeature more to allow for that

        if (this.config.style.arrowheadClass) {
	    switch (feature.get('strand')) {
            case 1:
            case '+':
                layoutEnd   += (this.plusArrowWidth / scale); break;
            case -1:
            case '-':
                layoutStart -= (this.minusArrowWidth / scale); break;
            }
        }

        var levelHeight = this.glyphHeight + this.glyphHeightPad;

        // if the label extends beyond the feature, use the
        // label end position as the end position for layout
        var name = this.getConfForFeature( 'style.label', feature );
        var description = scale > descriptionScale && this.getFeatureDescription(feature);
        if( description && description.length > this.config.style.maxDescriptionLength )
            description = description.substr(0, this.config.style.maxDescriptionLength+1 ).replace(/(\s+\S+|\s*)$/,'')+String.fromCharCode(8230);

        // add the label div (which includes the description) to the
        // calculated height of the feature if it will be displayed
	if( this.showLabels && scale >= labelScale && name ) {
            layoutEnd = Math.max(layoutEnd, layoutStart + (''+name).length * this.labelWidth / scale );
            levelHeight += this.labelHeight + this.labelPad;
        }
        if( description ) {
            layoutEnd = Math.max( layoutEnd, layoutStart + (''+description).length * this.labelWidth / scale );
            levelHeight += this.labelHeight + this.labelPad;
        }

        layoutEnd += Math.max(1, this.padding / scale);

        var top = this._getLayout( scale )
                      .addRect( uniqueId,
                                layoutStart,
                                layoutEnd,
                                levelHeight);

        if( top === null ) {
            // could not lay out, would exceed our configured maxHeight
            // mark the block as exceeding the max height
            this.markBlockHeightOverflow( block );
            return null;
        }

        var featDiv = this.config.hooks.create(this, feature );
        this._connectFeatDivHandlers( featDiv );
        // NOTE ANY DATA SET ON THE FEATDIV DOM NODE NEEDS TO BE
        // MANUALLY DELETED IN THE cleanupBlock METHOD BELOW
        featDiv.track = this;
        featDiv.feature = feature;
        featDiv.layoutEnd = layoutEnd;

        // (callbackArgs are the args that will be passed to callbacks
        // in this feature's context menu or left-click handlers)
        featDiv.callbackArgs = [ this, featDiv.feature, featDiv ];

        // save the label scale and description scale in the featDiv
        // so that we can use them later
        featDiv._labelScale = labelScale;
        featDiv._descriptionScale = descriptionScale;


        block.featureNodes[uniqueId] = featDiv;

        // record whether this feature protrudes beyond the left and/or right side of the block
        if( layoutStart < block.startBase ) {
            if( ! block.leftOverlaps ) block.leftOverlaps = [];
            block.leftOverlaps.push( uniqueId );
        }
        if( layoutEnd > block.endBase ) {
            if( ! block.rightOverlaps ) block.rightOverlaps = [];
            block.rightOverlaps.push( uniqueId );
        }

        dojo.addClass(featDiv, "feature");
        var className = this.config.style.className;
        if (className == "{type}") { className = feature.get('type'); }
        var strand = feature.get('strand');
        switch (strand) {
        case 1:
        case '+':
            dojo.addClass(featDiv, "plus-" + className); break;
        case -1:
        case '-':
            dojo.addClass(featDiv, "minus-" + className); break;
        default:
            dojo.addClass(featDiv, className);
        }
        var phase = feature.get('phase');
        if ((phase !== null) && (phase !== undefined))
//            featDiv.className = featDiv.className + " " + featDiv.className + "_phase" + phase;
            dojo.addClass(featDiv, className + "_phase" + phase);

        // check if this feature is highlighted
        var highlighted = this.isFeatureHighlighted( feature, name );

        // add 'highlighted' to the feature's class if its name
        // matches the objectName of the global highlight and it's
        // within the highlighted region
        if( highlighted )
            dojo.addClass( featDiv, 'highlighted' );

        // Since some browsers don't deal well with the situation where
        // the feature goes way, way offscreen, we truncate the feature
        // to exist betwen containerStart and containerEnd.
        // To make sure the truncated end of the feature never gets shown,
        // we'll destroy and re-create the feature (with updated truncated
        // boundaries) in the transfer method.
        var displayStart = Math.max( featureStart, containerStart );
        var displayEnd = Math.min( featureEnd, containerEnd );
        var blockWidth = block.endBase - block.startBase;
        var featwidth = Math.max( this.minFeatWidth, (100 * ((displayEnd - displayStart) / blockWidth)));
        featDiv.style.cssText =
            "left:" + (100 * (displayStart - block.startBase) / blockWidth) + "%;"
            + "top:" + top + "px;"
            + " width:" + featwidth + "%;"
            + (this.config.style.featureCss ? this.config.style.featureCss : "");

        if ( this.config.style.arrowheadClass ) {
            var ah = document.createElement("div");
            var featwidth_px = featwidth/100*blockWidth*scale;

            switch (strand) {
            case 1:
            case '+':
                ah.className = "plus-" + this.config.style.arrowheadClass;
                ah.style.cssText =  "right: "+(-this.plusArrowWidth) + "px";
                featDiv.appendChild(ah);
                break;
            case -1:
            case '-':
                ah.className = "minus-" + this.config.style.arrowheadClass;
                ah.style.cssText = "left: " + (-this.minusArrowWidth) + "px";
                featDiv.appendChild(ah);
                break;
            }
        }

        if (name && this.showLabels && scale >= labelScale || description ) {
            var labelDiv = dojo.create( 'div', {
                    className: "feature-label" + ( highlighted ? ' highlighted' : '' ),
                    innerHTML:  ( name ? '<div class="feature-name">'+name+'</div>' : '' )
                               +( description ? ' <div class="feature-description">'+description+'</div>' : '' ),
                    style: {
                        top: (top + this.glyphHeight + 2) + "px",
                        left: (100 * (layoutStart - block.startBase) / blockWidth)+'%'
                    }
                }, block.domNode );

            this._connectFeatDivHandlers( labelDiv );

            featDiv.label = labelDiv;

            // NOTE: ANY DATA ADDED TO THE labelDiv MUST HAVE A
            // CORRESPONDING DELETE STATMENT IN cleanupBlock BELOW
            labelDiv.feature = feature;
            labelDiv.track = this;
            // (callbackArgs are the args that will be passed to callbacks
            // in this feature's context menu or left-click handlers)
            labelDiv.callbackArgs = [ this, featDiv.feature, featDiv ];
        }

	this.renderArrows(feature, featDiv, displayStart, displayEnd, block);

        // render the popup menu if configured
        //if( this.config.menuTemplate ) {
            //window.setTimeout( dojo.hitch( this, '_connectMenus', featDiv ), 50+Math.random()*150 );
        //}

        if ( typeof this.config.hooks.modify == 'function' ) {
            this.config.hooks.modify(this, feature, featDiv);
        }

        return featDiv;
    },

    // Draw the arrows on either side of the primer glyph
    renderArrows: function( feature, featDiv,
                                 displayStart, displayEnd, block )  {

	var rightArrowDiv = document.createElement("div");
        dojo.addClass(rightArrowDiv, "minus-transcript-arrowhead");

	var leftArrowDiv = document.createElement("div");
        dojo.addClass(leftArrowDiv, "plus-transcript-arrowhead");

	var viewmin = this.browser.view.minVisible();
	var viewmax = this.browser.view.maxVisible();

	var fmin    = feature.get('start');
	var fmax    = feature.get('end');

	leftArrowDiv.style.left = -this.minusArrowWidth + 'px';
	rightArrowDiv.style.right = -this.plusArrowWidth + 'px';

        featDiv.appendChild(leftArrowDiv);
        featDiv.appendChild(rightArrowDiv);
    },

    /**
     * Get the height of a div.  Caches div heights based on
     * classname.
     */
    _getHeight: function( theDiv )  {
        if (this.config.disableHeightCache)  {
            return theDiv.offsetHeight || 0;
        }
        else  {
            var c = this.heightCache[ theDiv.className ];
            if( c )
                return c;
            c  = theDiv.offsetHeight || 0;
            this.heightCache[ theDiv.className ] = c;
            return c;
        }
    },

    /**
     * Vertically centers all the child elements of a feature div.
     * @private
     */
    _centerChildrenVertically: function( /**HTMLElement*/ featDiv ) {
        if( featDiv.childNodes.length > 0 ) {
            var parentHeight = this._getHeight(featDiv);
            for( var i = 0; i< featDiv.childNodes.length; i++ ) {
                var child = featDiv.childNodes[i];
                // only operate on child nodes that can be styled,
                // i.e. HTML elements instead of text nodes or whatnot
                if( child.style ) {
                    // cache the height of elements, for speed.
                    var h = this._getHeight(child);
                    dojo.style( child, { marginTop: '0', top: ((parentHeight-h)/2) + 'px' });
                    // recursively center any descendants
                    if (child.childNodes.length > 0)  {
                        this._centerChildrenVertically( child );
                    }
                }
            }
        }
    },

    /**
     * Connect our configured event handlers to a given html element,
     * usually a feature div or label div.
     */
    _connectFeatDivHandlers: function( /** HTMLElement */ div  ) {
        for( var event in this.eventHandlers ) {
            this.own( on( div, event, this.eventHandlers[event] ) );
        }
        // if our click handler has a label, set that as a tooltip
        if( this.eventHandlers.click && this.eventHandlers.click.label )
            div.setAttribute( 'title', this.eventHandlers.click.label );
    },

    _getLayout: function( scale ) {

        //determine the glyph height, arrowhead width, label text dimensions, etc.
        if (!this.haveMeasurements) {
            this.measureStyles();
            this.haveMeasurements = true;
        }

        // create the layout if we need to, and we can
        if( ( ! this.layout || this.layout.pitchX != 4/scale ) && scale  )
            this.layout = new Layout({
                                         pitchX: 4/scale,
                                         pitchY: this.config.layoutPitchY || (this.glyphHeight + this.glyphHeightPad),
                                         maxHeight: this.getConf('maxHeight')
                                     });


        return this.layout;
    },
    _clearLayout: function() {
        delete this.layout;
    },

    clear: function() {
        delete this.layout;
        this.inherited( arguments );
    },

    /**
     *   indicates a change to this track has happened that may require a re-layout
     *   clearing layout here, and relying on superclass BlockBased.changed() call and
     *   standard _changedCallback function passed in track constructor to trigger relayout
     */
    changed: function() {
        this._clearLayout();
        this.inherited(arguments);
    },

    _exportFormats: function() {
        return [ 'GFF3', 'BED' ]
    },

    _trackMenuOptions: function() {
        var o = this.inherited(arguments);
        var track = this;

        o.push.apply(
            o,
            [
                { type: 'dijit/MenuSeparator' },
                { label: 'Show labels',
                  type: 'dijit/CheckedMenuItem',
                  checked: !!( 'showLabels' in this ? this.showLabels : this.config.style.showLabels ),
                  onClick: function(event) {
                      track.showLabels = this.checked;
                      track.changed();
                  }
                }
            ]
        );

        return o;
    }

});

return PrimerFeatures;
});

/*

Created by Nathan Liles <nml5566@gmail.com>
Based on JBrowse/View/Track/HTMLFeatures

*/
