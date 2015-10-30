String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length == 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

var VERTICALFLOAT = {
    DATA_URI: "https://tmc.mooc.fi/org/hy/courses/59/points.json?api_version=7&t=" + new Date().getTime(),
    minOpacity: 0.4,
    maxOpacity: 1,
    analyticsChart: null,
    username: null,
    userdata: null,
    maxPoints: [],

    init: function(username) {
        VERTICALFLOAT.username = username;
	
	if(!VERTICALFLOAT.username) {
	    console.log("Analytics: not initiating.");
	    return;
        }
	
	VERTICALFLOAT.reload();
    },
    reloadData: function(callback) {
	$.get(VERTICALFLOAT.DATA_URI, function(data) {
	    if(!data["sheets"]) {
		console.log("Analytics: no overall data on assignmens -- not initiating.");
		return;
	    }

	    VERTICALFLOAT.maxPoints = [];
            for (var i = 0; i < 7; i++) {
		if(!data["sheets"][i]) {
		    continue;
		}

		VERTICALFLOAT.maxPoints[i] = data["sheets"][i]["total_available"];
	    }

	    if(!data["awarded_for_user_and_sheet"]) {
		console.log("Analytics: no result data -- not initiating.");
		return;
	    }

            var userdata = data["awarded_for_user_and_sheet"][VERTICALFLOAT.username];
	    if(!userdata) {
		console.log("Analytics: no such username in result data -- not initiating.");
		return;
	    }
	    
	    VERTICALFLOAT.userdata = userdata;
	    callback();
	});
    },
    reload: function() {
	console.log("Analytics: (re-)loading.");
	VERTICALFLOAT.reloadData(function() {
	    VERTICALFLOAT.initWithData();
	});
    },
    initWithData: function() {
	$("body").append("<div class='floater'></div>");

	$(".floater").append("<img id='analytics' src='../img/icons/analytics-two-64.png' width='64'></img>");
	VERTICALFLOAT.addFadeEffect("analytics");

	VERTICALFLOAT.addInteractivity();
        VERTICALFLOAT.setFloaterStyle();

	$(window).resize(function() {
	    if($(this).width() < 900) {
		$(".floater").hide();
	    } else {
		$(".floater").show();		
	    }
	});

	VERTICALFLOAT.showAnalytics();
    },    
    setFloaterStyle: function() {
	$(".floater").css("position", "fixed");
	$(".floater").css("right", "0px");
	$(".floater").css("bottom", "0px");
	$(".floater").css("line-height", "32px");
	$(".floater").css("border-radius", "6px");
	$(".floater").css("padding", "4px");

        $("#analytics").css("padding", "2px");
        $("#chat").css("padding", "2px");

	if($(window).width() < 900) {
	    $(".floater").hide();
	} else {
	    $(".floater").show();		
	}
    },
    addFadeEffect: function(elementId) {
        $("#" + elementId).css("opacity", VERTICALFLOAT.minOpacity);

	$("#" + elementId).hover(
	    function() {
		$(this).fadeTo('slow', 1);
	    },
	    function() {
		$(this).fadeTo('slow', VERTICALFLOAT.minOpacity);
	    }
	);
    },
    addInteractivity: function() {
	$("#analytics").click(function() {
	    var data = {};
	    data.type = "analytics-vis";

	    try {
		data.visiblePreClick = $("#analytics-chart-area").length > 0
	    } catch (err) {
	    }
	    
	    VERTICALFLOAT.showAnalytics();

	    data.visiblePostClick = $("#analytics-chart-area").length > 0;
	    pheromones.storage.addClick(data);
	});
    },
    showAnalytics: function() {
	if($("#analytics-chart-area").length) {
	    VERTICALFLOAT.hideAnalytics();
	    return; // exists already
	}

	var group = VERTICALFLOAT.getUserGroup();

	var teksti = "Viikoittaisia tehtäväpisteitä kerätty -- (<a id='update-statistics'>päivitä</a>)";
	
	if (group.valueOf() == "TREATMENT") {
	    teksti = "Viikoittaisia tehtäväpisteitä kerätty -- (<a id='update-statistics'>päivitä</a>)";
	}

	$("body").append("<div id='analytics-chart-area'><div id='analytics-chart'></div><center><small><em>" + teksti + "</em></small></center></div>");

	$("#analytics-chart-area").css("margin", "auto");
	$("#analytics-chart-area").css("position", "fixed");
	$("#analytics-chart-area").css("right", "4px");
	$("#analytics-chart-area").css("bottom", "4px");
	$("#analytics-chart-area").css("border-radius", "6px");
	$("#analytics-chart-area").css("padding", "4px");
	$("#analytics-chart-area").css("background-color", "white");
	$("#analytics-chart-area").css("box-shadow", "0px 0px 25px #000000");


	if(group.valueOf() == "TREATMENT") {
	    VERTICALFLOAT.showTreatmentVisu();
	} else {
	    VERTICALFLOAT.showControlVisu();
	}

	$("#analytics-chart-area").click(function() {
	    VERTICALFLOAT.hideAnalytics();	    
	});

	$("#update-statistics").click(function() {
	    VERTICALFLOAT.hideAnalytics();	  
	    VERTICALFLOAT.reloadData(function() {
		VERTICALFLOAT.showAnalytics();
	    });
	});
    },
    showTreatmentVisu: function() {
	var data = {
	    labels: ['W0', 'W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'],
	    series: []
	}

	var tmp = 100;
	data.series[0] = {
	    name: 'potentialGrowth',
	    data: [0, tmp, tmp*2, tmp*3, tmp*4, tmp*5, tmp*6, tmp*7]
	};

	var realizedGrowth = [0];
	var sumSoFar = 0;

	for (var i = 1; i <= 7; i++) {
	    var weekdata = VERTICALFLOAT.userdata["wk" + i];

	    if(!weekdata || !VERTICALFLOAT.maxPoints[i - 1] || weekdata == 0) {
		realizedGrowth[i] = sumSoFar;
		continue;
	    }
	    
	    var percentageFinished = (100 * weekdata / VERTICALFLOAT.maxPoints[i - 1]);
	    sumSoFar += percentageFinished;
	    realizedGrowth[i] = sumSoFar;
	}

	data.series[1] = {
	    name: 'realizedGrowth',
	    data: realizedGrowth
	};

	var options = {
	    high: 700,
	    low: 0,
	    width: 360,
	    height: 280,
	    axisY: {
		offset: 40,
		labelInterpolationFnc: function(value) {
		    return value
		},
		scaleMinSpace: 20
	    },
	    series: {
		'potentialGrowth': {
		    showArea: false, /* switch to true to show */
		    showLine: false,
		    showPoint: false
		},
		'realizedGrowth': {
		    showPoint: true
		}
	    }
	};
	
	VERTICALFLOAT.analyticsChart = new Chartist.Line('#analytics-chart', data, options);
    },
    showControlVisu: function() {
	var data = {
	    labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'],
	    series: []
	}

	data.series[0] = [];

	for (var i = 1; i <= 7; i++) {
	    var weekdata = VERTICALFLOAT.userdata["wk" + i];
	    if(!weekdata || !VERTICALFLOAT.maxPoints[i - 1] || weekdata == 0) {
		data.series[0][i - 1] = 0;
		continue;
	    }
	    
	    var percentageFinished = (100 * weekdata / VERTICALFLOAT.maxPoints[i - 1]);
	    data.series[0][i - 1] = percentageFinished;
	}

	var options = {
	    high: 100,
	    low: 0,
	    width: 360,
	    height: 280,
	    axisY: {
		offset: 50,
		labelInterpolationFnc: function(value) {
		    return value
		},
		scaleMinSpace: 40
	    }
	};

	VERTICALFLOAT.analyticsChart = new Chartist.Bar('#analytics-chart', data, options);
    },
    hideAnalytics: function() {
	if(VERTICALFLOAT.analyticsChart) {
	    VERTICALFLOAT.analyticsChart.detach();
	}

	$("#analytics-chart").remove();
	$("#analytics-chart-area").remove();
    },
    getUserGroup: function() {
	if(((Math.abs(VERTICALFLOAT.username.hashCode()) + 5) % 20) < 10) {
	    return "CONTROL";
	} else { 
	    return "TREATMENT";
	}
    }
};
