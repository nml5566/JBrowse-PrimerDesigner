define([
           'dojo/_base/declare',
           'JBrowse/Plugin',
           "JBrowse/View/FileDialog/TrackList/GFF3Driver",
           'dijit/MenuItem',
           'dijit/Dialog',
           'dijit/form/Button',
	],
       function(
           declare,
           JBrowsePlugin,
           GFF3Driver,
           dijitMenuItem,
           dijitDialog,
           dijitButton
       ) {
return declare( JBrowsePlugin,
{
    constructor: function( args ) {
        var that = this;

	this.location = args.location;
	this.GFF3Driver = GFF3Driver;
	this.params = {
	    user_set: false,
	    PRIMER_MIN_SIZE: "18",
	    PRIMER_OPT_SIZE: "20",
	    PRIMER_MAX_SIZE: "27",
	    PRIMER_PAIR_MAX_MISPRIMING: "24.00",
	    PRIMER_MIN_GC: "20.0",
	    PRIMER_OPT_GC_PERCENT: "",
	    PRIMER_MAX_GC: "80.0",
	    PRIMER_MAX_END_STABILITY: "9.0",
	    PRIMER_MIN_TM: "57.0",
	    PRIMER_OPT_TM: "60.0",
	    PRIMER_MAX_TM: "63.0",
	    PRIMER_SELF_ANY: "8.00",
	    PRIMER_PRODUCT_SIZE_RANGE: "",
	    PRIMER_SELF_END: "3.00",
	    PRIMER_NUM_RETURN: "3",
	    PRIMER_MAX_POLY_X: "5",
	};

	dojo.subscribe("/jbrowse/v1/n/globalHighlightChanged", function () {
		that.setPrimerSizeRange();
	});
	
	args.browser.afterMilestone('completely initialized', function () {
	    that.addMenu();
	});

    },
    setPrimerSizeRange: function () {
	console.log('setting primer range');
	var hl = this.browser.getHighlight();

	if (hl === null ) {
	    //console.log('clearing primer range');
	    //this.params.PRIMER_PRODUCT_SIZE_RANGE = "";
	    return;
	} else if (this.params.PRIMER_PRODUCT_SIZE_RANGE == ""
	    || this.params.user_set === false) {
	    /* reset user modification flag when range is blank */
	    this.params.user_set = false;

	    /* Set default product size range for highlighted region if */
	    var min_size = hl.end - hl.start;
	    var max_size = min_size + 300/*maxrange*/;

	    var x = [];
	    var sizes = [min_size, max_size];
	    for (i=0;i < sizes.length;i++) {
		x.push(Math.floor(sizes[i]/50.0) * 50);
	    }
	    this.params.PRIMER_PRODUCT_SIZE_RANGE = x[0]+'-'+x[1];

	    console.log('primer range now '+this.params.PRIMER_PRODUCT_SIZE_RANGE);
	} else {
	    console.log('no change');
	}

    },
    addMenu: function () {
    	var that = this;
    	var browser = this.browser;
	browser.addGlobalMenuItem( 'primerdesigner', new dijitMenuItem(
		{
		    label: "Design primers",
		    onClick: function() {
			that.designPrimers();
		    }
		}));

	browser.addGlobalMenuItem( 'primerdesigner', new dijitMenuItem(
		{
		    label: "Settings",
		    onClick: function() {
			that.settingsMenu();
		    }
		}));
	browser.renderGlobalMenu("primerdesigner", {
	    text: "PrimerDesigner"
	}, browser.menuBar);

    },
    settingsMenu: function () {

	var shareURL = '#';

	var container = dojo.create(
	    'div', {
		innerHTML: 'Paste this link in <b>email</b> or <b>IM</b>'
	});

	var that = this;
	var button = new dijitButton({
            className: 'save',
            innerHTML: '<span class="icon"></span> Save',
            title: 'save settings'
	});

	var help = 'http://frodo.wi.mit.edu/input-help.htm#';
	var p = this.params;
	table = dojo.create("table", null, dojo.body());
	var row1 = dojo.create("tr", null, table);

	var r1c1 = dojo.create("td", null, row1);
	dojo.create("a", { href: help+"PRIMER_SIZE", 
	    name: "PRIMER_OPT_SIZE_INPUT", 
	    innerHTML: "<b>Primer Size</b>" }, r1c1);

	var r1c2 = dojo.create("td", null, row1);
	var r1c2txt = dojo.create("span", { innerHTML: "Min. " }, r1c2);
	dojo.create("input", { type: "text", name: "PRIMER_MIN_SIZE", 
	    value: p.PRIMER_MIN_SIZE, size: "4" }, r1c2txt);
	dojo.create("span", { innerHTML: " Opt. " }, r1c2txt);
	dojo.create("input", { type: "text", name: "PRIMER_OPT_SIZE", 
	    value: p.PRIMER_OPT_SIZE, size: "4" }, r1c2txt);
	dojo.create("span", { innerHTML: " Max. " }, r1c2txt);
	dojo.create("input", { type: "text", name: "PRIMER_MAX_SIZE", 
	    value: p.PRIMER_MAX_SIZE, size: "4" }, r1c2txt);

	var r1c3 = dojo.create("td", null, row1);
	dojo.create("a", { href: help+"PRIMER_PAIR_MAX_MISPRIMING", 
	    name: "PRIMER_PAIR_MAX_MISPRIMING_INPUT", 
	    innerHTML: "<b>Pair Max Mispriming:</b>", target: "_new" }, r1c3);

	var r1c4 = dojo.create("td", null, row1);
	dojo.create("input", { type: "text", size: "4",
	    value: p.PRIMER_PAIR_MAX_MISPRIMING, 
	    name: "PRIMER_PAIR_MAX_MISPRIMING"
	    }, r1c4);

	var row2 = dojo.create("tr", null, table);

	var r2c1 = dojo.create("td", null, row2);
	dojo.create("a", { href: help+"PRIMER_GC_PERCENT", 
	    name: "PRIMER_GC_PERCENT_INPUT", 
	    innerHTML: "<b>Primer GC%</b>", target: "_new" }, r2c1);
	var r2c2 = dojo.create("td", null, row2);
	var r2c2txt = dojo.create("span", { innerHTML: "Min. " }, r2c2);
	dojo.create("input", { type: "text", name: "PRIMER_MIN_GC", 
	    value: p.PRIMER_MIN_GC, size: "4" }, r2c2txt);
	dojo.create("span", { innerHTML: " Opt. " }, r2c2txt);
	dojo.create("input", { type: "text", name: "PRIMER_OPT_GC_PERCENT", 
	    value: p.PRIMER_OPT_GC_PERCENT, size: "4" }, r2c2txt);
	dojo.create("span", { innerHTML: " Max. " }, r2c2txt);
	dojo.create("input", { type: "text", name: "PRIMER_MAX_GC", 
	    value: p.PRIMER_MAX_GC, size: "4" }, r2c2txt);

	var r2c2 = dojo.create("td", null, row2);
	dojo.create("a", { target: "_new",
	    href: help+"PRIMER_MAX_END_STABILITY", 
	    name: "PRIMER_MAX_END_STABILITY_INPUT",
	    innerHTML: "<b>Max 3&prime; Stability:</b>" }, r2c2);
	var r2c3 = dojo.create("td", null, row2);
	dojo.create("input", { type: "text", name: "PRIMER_MAX_END_STABILITY", 
	    value: p.PRIMER_MAX_END_STABILITY, size: "4" }, r2c3);

	var row3 = dojo.create("tr", null, table);

	var r3c1 = dojo.create("td", null, row3);
	dojo.create("a", { href: help+"PRIMER_TM", 
	    name: "PRIMER_OPT_TM_INPUT", 
	    innerHTML: "<b>Primer Tm</b>", target: "_new" }, r3c1);
	var r3c2 = dojo.create("td", null, row3);
	var r3c2txt = dojo.create("span", { innerHTML: "Min. " }, r3c2);
	dojo.create("input", { type: "text", name: "PRIMER_MIN_TM", 
	    value: p.PRIMER_MIN_TM, size: "4" }, r3c2txt);
	dojo.create("span", { innerHTML: " Opt. " }, r3c2txt);
	dojo.create("input", { type: "text", name: "PRIMER_OPT_TM", 
	    value: p.PRIMER_OPT_TM, size: "4" }, r3c2txt);
	dojo.create("span", { innerHTML: " Max. " }, r3c2txt);
	dojo.create("input", { type: "text", name: "PRIMER_MAX_TM", 
	    value: p.PRIMER_MAX_TM, size: "4" }, r3c2txt);

	var r3c2 = dojo.create("td", null, row3);
	dojo.create("a", { target: "_new",
	    href: help+"PRIMER_MAX_END_STABILITY", 
	    name: "PRIMER_MAX_END_STABILITY_INPUT",
	    innerHTML: "<b>Max Self Complementarity:</b>" }, r3c2);
	var r3c3 = dojo.create("td", null, row3);
	dojo.create("input", { type: "text", name: "PRIMER_SELF_ANY", 
	    value: p.PRIMER_SELF_ANY, size: "4" }, r3c3);

	var row4 = dojo.create("tr", null, table);

	var r4c1 = dojo.create("td", null, row4);
	dojo.create("a", { href: "javascript:void(0)",
	    onclick: "alert(\'Format xxx-xxx\nBy default, the smallest product size to flank the feature will be selected\nUse this option to force a particular amplicon size and.or reduce computation time\')",
	    name: "PRIMER_PRODUCT_SIZE_RANGE", 
	    innerHTML: "<b>Primer size range:</b>" }, r4c1);
	var r4c2 = dojo.create("td", null, row4);

	dojo.create("input", { type: "text", id: "product_size_range",
	    name: "PRIMER_PRODUCT_SIZE_RANGE", 
	    value: p.PRIMER_PRODUCT_SIZE_RANGE, size: "8" }, r4c2);

	var r4c3 = dojo.create("td", null, row4);
	dojo.create("a", { href: help+"PRIMER_SELF_END",
	    innerHTML: "<b>Max 3&prime; Self Complementarity</b>",
	    name: "PRIMER_SELF_END_INPUT", target: "_new" }, r4c3);

	var r4c4 = dojo.create("td", null, row4);
	dojo.create("input", { type: "text", 
	    name: "PRIMER_SELF_END",
	    value: p.PRIMER_SELF_END, size: "4" }, r4c4);

	var row5 = dojo.create("tr", null, table);

	var r5c1 = dojo.create("td", null, row5);
	dojo.create("a", { href: help+"PRIMER_NUM_RETURN",
	    name: "PRIMER_NUM_RETURN_INPUT", target: "_new",
	    innerHTML: "<b>Primer sets:</b>" }, r5c1);
	var r5c2 = dojo.create("td", null, row5);
	dojo.create("input", { type: "text", 
	    name: "PRIMER_NUM_RETURN", 
	    value: p.PRIMER_NUM_RETURN, size: "4" }, r5c2);

	var r5c2 = dojo.create("td", null, row5);
	dojo.create("a", { href: help+"PRIMER_MAX_POLY_X",
	    name: "PRIMER_MAX_POLY_X_INPUT", target: "_new",
	    innerHTML: "<b>Max Poly-X:</b>" }, r5c2);
	var r5c3 = dojo.create("td", null, row5);
	dojo.create("input", { type: "text", 
	    name: "PRIMER_MAX_POLY_X", 
	    value: p.PRIMER_MAX_POLY_X, size: "4" }, r5c3);

	var settingsPane = new dijitDialog({
            className: 'primerDesignerSettings',
            title: 'PrimerDesigner settings',
            draggable: false,
            content: [ table, button.domNode ],
            autofocus: false
        });
	button.onClick = function () { that.saveSettings(settingsPane) }
        settingsPane.show();

    },
    saveSettings: function (settingsPane) {
	var attr = this.getParams();
	var params = this.params;
	for (var i = 0; i < attr.length; i++) {
	    params[attr[i].name] = attr[i].value;
	}

	/* flag when user changes settings so they don't get overwritten */
	params.user_set = true;

        settingsPane.hide();
    },
    getParams: function () {
    //fetch all intputs with name="PRIMER_*" pattern
	var el, attr, i, j, arr = [],
	reg = new RegExp('^PRIMER_', 'i'),                
	els = document.body.getElementsByTagName('*'); 

	for (i = 0; i < els.length; i++) {                 
	    el = els[i]                                   
	    attr = el.attributes;                        
	    if (el.tagName == 'INPUT') {
		search: for (j = 0; j < attr.length; j++) {     
		    if (attr[j].name == 'name' && reg.test(attr[j].value)) {              
			arr.push(el);                          
			break search;                          
		    }
		}
	    }
	}
	return arr;
    },
    _makeStoreConfs: function (data) {
	
    	var url = this.location+'/'+data.gff;
    	var resource = { url: url, type: 'gff3' };
    	var driver = new this.GFF3Driver();
	return {
	    type: driver.storeType,
	    blob: driver._makeBlob( resource ),
	    name: data.gff
	};
    },
    designPrimers: function () {

	var that = this;
	var browser = this.browser;
	var hl = browser.getHighlight();

	if (hl === null) {
	    alert('Highlight a region before designing primers');
	    return;
	} else {
	    //Set 2x (here & at construction) b/c it's possible to highlight
	    //via url parameters only and bypass the javascript hook entirely
	    this.setPrimerSizeRange();
	}

	browser.loadRefSeqs().then( function () {
	    browser.getRefSeq(hl.ref, function (ref) {

		browser.getStore('refseqs', function (store) {

		    var query = {
			ref: hl.ref,
			start: hl.start,
			end: hl.end
		    }

		    // @args: query, featureCallback, finishCallback,
		    // errorCallback
		    store.getFeatures(query, function(f) {
		    /* iterate feats */
			that._designPrimers(f);
		    }, function () {
		    /* finish */
		    }, function (error) {
		    /* error */
			alert('Could not design primers. See console error log');
			console.error(error, error.stack);
		    });
		});
	    })
	});
    },
    _designPrimers: function (f) {

	var url = this._makeURL('/bin/primer-designer.pl');
	var that = this;
	var content = {start: f.start, end: f.end, ref: f.seq_id, seq: f.seq};
	var params = this.params;
	for (var p in params) {
	    content[p] = params[p];
	}
	dojo.xhrPost({
	    url: url,
	    handleAs: 'json',
	    content: content,
	    load: function(data) {
		if (data.error) {
		    that.displayError(data.error);
		} else {
		    that.addTrack(data,f);
		}
	    },
	    error: function (error) {
		console.error(error);
		console.error(error.stack);
	    }
	});
    },
    displayError: function(error) {
	var errorPane = new dijitDialog({
            className: 'primerDesignerError',
            title: 'PrimerDesigner error',
            draggable: false,
            content: error,
            autofocus: false
        });
        errorPane.show();
    },
    addTrack: function(data,f) {

	var confs = [{
	    key: "Primers for "+f.seq_id+':'+f.start+'..'+f.end,
	    label: data.dir, /* unique label */
	    store: this._makeStoreConfs(data),
	    style: {
		"labelScale": "0", 
		"label": function(feature) { 
		    return 'PCR primer set '+feature.get('id')+' (click for report)' 
		},
	    },
	    description: 1,
	    onClick: {   
		"label": "PRIMER3-style report for set {name}", 
		"url": this.location+"/"+data.dir+"/report_{name}.html"
	    },
	    type: "JBrowse/View/Track/HTMLFeatures"
	}];

	dojo.forEach( confs, function( conf ) {
	    var storeConf = conf.store;
	    if( storeConf && typeof storeConf == 'object' ) {
		delete conf.store;
		var name = this._addStoreConfig( storeConf.name, storeConf );
		conf.store = name;
	    }
	},this.browser);
	
	dojo.publish("/jbrowse/v1/v/tracks/new", [confs]);
	dojo.publish("/jbrowse/v1/v/tracks/show", [confs]);

    },
    _makeURL: function( subpath, query ) {
        var url = '.'+this.config.baseUrl + subpath;
        if( query ) {
            query = dojo.mixin( {}, query );
            if( this.config.query )
                query = dojo.mixin( dojo.mixin( {}, this.config.query ),
                                    query
                                  );
            var ref = query.ref || (this.refSeq||{}).name;
            delete query.ref;
            url += (ref ? '/' + ref : '' ) + '?' + ioquery.objectToQuery( query );
        }
        return url;
    },


});
});
