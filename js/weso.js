var SITE = {
    init: function() {
	Material.createContentList();
	Material.createExerciseList();
//	sh_highlightDocument();
//         SITE.initToc();
    },
    initToc: function() {
        $(".tehtava").each(function(index, value) {
            var exCount = (index + 1);
            var exName = "Tehtävä " + exCount + ": " + $(value).find("h1 a").text();

            // add assignments to toc 
            $("#tehtavat-toc").append("<li><a data-toggle='collapse' href='" + $(value).find("h1 a").attr("href") + "'>" + exName + "</a></li>");

            // add links to assignment names
            $(value).attr("id", $(value).find("h1 a").attr("href").substring(1) + "-ex");

            // relabel assignments
            $(value).find("header h1 a").text(exName);

            // tag subassignments
            $(value).find("div h1").each(function(subIndex, value) {
                $(value).text(exCount + "." + (subIndex + 1) + ": " + $(value).text());
            });
        });

        // link toc to assignments
        $("#tehtavat-toc a").each(function(index, value) {
            $(value).click(function() {
                $('html, body').animate({
                    scrollTop: $($.attr(this, 'href') + "-ex").offset().top
                }, 400);

                $($.attr(this, 'href')).click();
            });
        });

        var idx = 1;
        $("section h1").each(function(index, value) {
            if ($(value).parents('.tehtava').length) {
                return; // ignore assignments
            }

            if ($(value).parents('.no-toc').length) {
                return; //ignore sections with .no-toc
            }

            if ($(value).parent('section').length) {


                var chapterCount = idx;

                var chapterText = chapterCount + ". " + $(value).text();
                
                console.log(chapterText);

                $(value).attr("id", "chapter" + chapterCount);
                $(value).text(chapterText);

                // add chapters to toc 
                $("#material-toc").append("<li><a href='#chapter" + chapterCount + "'>" + chapterText + "</a></li>");
                idx++;

                // iterate through siblings
                var sibling = $(value).next();
                var count = 1;
                while (sibling) {
                    // do not relabel assignments
                    if (!$(sibling).prop("tagName") || $(sibling).prop("tagName").toLowerCase() === "h1") {
                        break;
                    }

                    if ($(sibling).prop("tagName").toLowerCase() === "h2") {
                        var subChapterText = (chapterCount + "." + count + ". " + $(sibling).text());
                        $(sibling).text(subChapterText);
                        var id = "chapter" + chapterCount + "-" + count;
                        $(sibling).attr("id", id);
                        
                        $("#material-toc").append("<li><a href='#" + id + "'>&nbsp;&nbsp;&nbsp;" + subChapterText + "</a></li>");
                        
                        count++;
                    }


                    sibling = $(sibling).next();
                    
                    if(sibling.length <= 0) {
                        break;
                    }
                }
            }

        });

    }
};

var auth = {
    username: "",
    password: "",
    authed: false,
    tmc_url: "https://tmc.mooc.fi/#{h tmc_instance}/auth.json",
    date_asked: new Date(),
    init: function(){
        auth.username = localStorage.getItem("tmc.account.name");
        var maybeDate = localStorage.getItem("tmc.date_asked");
        if ("null" != maybeDate){
            auth.date_asked = maybeDate;
        }
    },
    persistent: function(){
        localStorage.setItem("tmc.account.name", auth.username);
        localStorage.setItem("tmc.date_asked", auth.date_asked);
    },
    logout: function(){
        localStorage.setItem("tmc.account.name", "");
        location.reload();
    },
    authenticate: function(successFunc){
        console.log("authing");
        $("#tmcAuthModal").modal("show");
	
        $("#TmcLoginForm").submit(function(event) {
            var tmcAccount = $("#inputTmcAccount").val();
            auth.username = tmcAccount;
            localStorage.setItem("tmc.account.name", auth.username);
            auth.authed = true;
            $("#tmcAuthModal").modal('hide');
            successFunc();
	    
            return false;
        });
    }
};

function tmcAuth(callbackFunction){
    var logoutButton = $('#logout');
    logoutButton.hide();
    auth.init();
    var needToAskAuth = true;
    // init db
    console.log(JSON.stringify(auth));
    var datee = Date.parse(auth.date_asked);
    
    if (undefined ==  datee){
        datee = new Date();
        auth.date_asked = datee;
    }    
    
    var date1 = new Date();
    date1.setDate(date1.getDate() - 2);
    
    if (null == localStorage.getItem("tmc.version")){
        localStorage.setItem("tmc.version", "0");
    }
    if ( auth.username && auth.username.length > 1 && "null" != auth.username){
        var deprecatedSettings = localStorage.getItem("tmc.version");
        if ( deprecatedSettings && deprecatedSettings.length > 0 ){
            deprecatedSettings = parseInt(deprecatedSettings) || 0;
            if (deprecatedSettings >= 2){
                needToAskAuth = false;
            }
        }
    }
    
    localStorage.setItem("tmc.version", "2");
    if (needToAskAuth){
        auth.authenticate(function() {
            callbackFunction();
        });
        needToAskAuth = false;
    } else {
        callbackFunction();
    }
        
    $('#logout').click(function(){
        auth.logout();
        auth.authenticate();
    });
    
    auth.persistent();
}


$(function() {
    console.log("Init headers");
    SITE.init();
    console.log("Init syntax highlighting");

    try {
	if(window.location.search.indexOf("muotoilu") == -1) {
	    sh_highlightDocument('js/libs/syntaxhighlight/lang/', '.min.js');
	}
    } catch (t) {
	sh_highlightDocument('js/libs/syntaxhighlight/lang/', '.min.js');
    }

    tmcAuth(function() {
	if(!auth.username) {
	    return;
	}

	$('#logout').show();
        $('#logout').append(": " + auth.username);
	
	var storedUsername = localStorage.getItem("tmc.account.name");
	logger.setUser(storedUsername);
	logger.setApiUrl("http://data.pheromones.io/")
	logger.init();
	
	pheromones.init({
            apiUrl: "http://data.pheromones.io/",
            username: storedUsername,
            submitAfter: 20
	});
	
	VERTICALFLOAT.init(storedUsername);
    });
});

