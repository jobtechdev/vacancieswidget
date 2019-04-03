

(function (window, document) {
    var httpRequestString = "";
    var jQuery, $;
    var baseUrl = 'https://api.arbetsformedlingen.se/af/v0/platsannonser/';
    var $pagination,
        $afWidgetContainer,
        defaultOpts,
        annonsTableBody,
        afModal,
        activeRow;
    var s

var scriptBaseUrl = document.getElementById("AfPbWidget").src
    var pathArray = scriptBaseUrl.split( '/' );
    var protocol = pathArray[0];
    var host = pathArray[2];
    var scriptUrl = protocol + '//' + host +'/'+ pathArray[3];
    console.log(scriptUrl);

    function getStylesheet(url){
        var linkElement = document.createElement('link');
        linkElement.href=url;
        linkElement.rel='stylesheet';
        var head = document.getElementsByTagName('head')[0],
            done = false;
        // Attach handlers for all browsers
        linkElement.onload = linkElement.onreadystatechange = function () {
            if (!done && (!this.readyState
                    || this.readyState == 'loaded'
                    || this.readyState == 'complete')) {
                done = true;
                //success();
                linkElement.onload = linkElement.onreadystatechange = null;
                // head.removeChild(linkElement);
            }
        };
        head.appendChild(linkElement);
    }

    function getScript(url, success) {
        var script = document.createElement('script');
        script.src = url;
        var head = document.getElementsByTagName('head')[0],
            done = false;
        // Attach handlers for all browsers
        script.onload = script.onreadystatechange = function () {
            if (!done && (!this.readyState
                || this.readyState == 'loaded'
                || this.readyState == 'complete')) {
                done = true;
                success();
                script.onload = script.onreadystatechange = null;
                head.removeChild(script);
            }
        };
        head.appendChild(script);
    }

    window.onload = function () {
        //Load jQuery version 3.2.0 if it isn't already loaded.
        if (typeof jQuery == 'undefined' || window.jQuery.fn.jquery !== '3.2.0') {
            getScript('https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.js', function () {
                if (typeof window.jQuery == 'undefined') {
                    if (window.console) console.log('Sorry, but jQuery wasn\'t able to load');
                } else {
                    $ = jQuery = window.jQuery.noConflict();
                    if (window.console) console.log('This page is now jQuerified with v' + jQuery.fn.jquery);
                    main($);
                }
            });
        } else {
            if (window.console) console.log('jQuery v'+ jQuery.fn.jquery+' already loaded!');
            main();
        }

    };
  

    var main = function ($) {
        getStylesheet(scriptUrl+"/"+'css/bootstrap.css');
        getStylesheet(scriptUrl+"/"+'css/AfPbWidget.css');

        var  $afJobCount = $('#afJobCount');
        
        if ($afJobCount.length) {
            if(!$afJobCount[0].dataset.organisationsnummer) {
                httpRequestString = baseUrl + "matchning?lanid=" + $afJobCount[0].dataset.lanid + "&kommunid=" + $afJobCount[0].dataset.kommunid +"&yrkesid="+$afJobCount[0].dataset.yrkesid+"&yrkesgruppid="+  $afJobCount[0].dataset.yrkesgruppid;

                //Get 'antal_platsannonser'
                $.getJSON(httpRequestString, {
                    antal:"1"
                })

                    .done(function (annonsdata) {
                        totalPages = annonsdata.matchningslista.antal_platsannonser;
                        $afJobCount[0].innerHTML = totalPages;
                    })
                    .fail(function () {
                        $afJobCount.html("Missing data");
                        console.log("Couldn't get job ad from remote service");
                    });
            }else if($afJobCount[0].dataset.organisationsnummer) {
                httpRequestString = baseUrl + "matchning?organisationsnummer="+$afJobCount[0].dataset.organisationsnummer + "matchning?lanid=" + $afJobCount[0].dataset.lanid + "&kommunid=" + $afJobCount[0].dataset.kommunid;

                //Get 'antal_platsannonser'
                $.getJSON(httpRequestString, {
                    antal:"1"
                })

                    .done(function (annonsdata) {
                        totalPages = annonsdata.matchningslista.antal_platsannonser;
                        $afJobCount[0].innerHTML = totalPages;
                    })
                    .fail(function () {
                        $afJobCount.html("Missing data");
                        console.log("Couldn't get job ad from remote service");
                    });
            }
            else{
                $afJobCount.html("Check tag parameter.");
            }
        }
        getScript(scriptUrl+"/"+"script/pagination.js", function(){

            getScript(scriptUrl+"/"+"script/jquery.modal.js", function(){
            $.modal.defaults = {
                fadeDuration: 200,
                closeExisting: true,
                escapeClose: true,
                clickClose: true,
                closeText: 'Close',
                closeClass: '',
                showClose: true,
                spinnerHtml: true,
                modalClass: "modal",
                showSpinner: true,
                fadeDelay: 1.0
            };

            $('body').prepend("<div id='afmodal' class='afmodal' style='display: none'></div>");


            afModal = $("#afmodal");

            afModal.load(scriptUrl+"/"+'template/templates.html #afmodal-content', function (response, status, xhr) {
                if (status == "error") {
                    console.log("Couldn't fetch a resource for job ads. Error:" + xhr.statusText); //TODO fix this, should go into modal window
                } else {
                    annonsTableBody = $('#afAnnonsTableBody')[0];
                    $pagination = $('#dynamic-total-pages-pagination');
                    defaultOpts = {
                        startPage: 1,
                        onPageClick: function (evt, page) {
                            getAds(page);
                            //Show new page from top..
                            $('#afListContent').animate({scrollTop: (0)});
                        }

                    };
                    $pagination.twbsPagination(defaultOpts);

                }
            });
            afModal.on($.modal.BEFORE_OPEN, function (event, modal) {
                getAds(1);
            });

            });

        });

        $afWidgetContainer = $('#afWidgetContainer');
        //Show The Window
        $afWidgetContainer[0].onclick = function () {
            $('#afmodal').modal ();
        };

        //do on click row in annons list
        $(document).on('click', '.afTableRow', function () {

            //Show ad

            deactivateActiveAnnons();
            activeRow = $(this);
            $(this).addClass('afRowActive');
            showAnnons(this.dataset.annonsid);
            //Scroll list: selected annons scrolled to top.
            var listContent = $('#afListContent');
            listContent.animate({scrollTop: (activeRow.offset().top - listContent.offset().top + listContent.scrollTop())});
        });

    };

    var deactivateActiveAnnons = function () {
        if (activeRow) {
            $('#afAnnonsContent').remove();
            activeRow.removeClass('afRowActive');
        }
    };

    var showAnnons = function (annonsid) {

        $('body').prepend("<div id='afAnnonsContent' class='afmodal' style='display: none'></div>");
        divElement = $("#afAnnonsContent");
        //divElement = $('#afAnnonsContent');
         //divElement = $(document.createElement('div'));








        divElement.load('template/templates.html #annonshtml', function (response, status, xhr) {
            if (status == "error") {
                console.log("Couldn't fetch a resource for job ads. Error:" + xhr.statusText); //TODO fix this, should go into modal window
            } else {



 

                //divElement.append(annonsTemplate);
                
                $.getJSON("https://api.arbetsformedlingen.se/af/v0/platsannonser/"+annonsid)
                    .done(function (annonsdata) {
                        //If the ad is lacking property "sista_ansokningsdag"
                        if(!annonsdata.platsannons.ansokan.sista_ansokningsdag){
                            annonsdata.platsannons.ansokan.sista_ansokningsdag = "Saknas";
                        }

                        $("#annonsRubrik").html(annonsdata.platsannons.annons.annonsrubrik);
                        $("#annonsKommun").append(annonsdata.platsannons.annons.kommunnamn);
                        $("#annonsArbetsplats").append(annonsdata.platsannons.arbetsplats.arbetsplatsnamn);
                        $("#annonsYrke").append(annonsdata.platsannons.annons.yrkesbenamning);
                        $("#annonsAntalPlatser").append(annonsdata.platsannons.annons.antal_platser);
                        $("#anstallningstyp").append(annonsdata.platsannons.annons.anstallningstyp);
                        $("#annonsText").html(annonsdata.platsannons.annons.annonstext);


                        if(annonsdata.platsannons.ansokan.webbplats){
                            $("#ansok").attr("href",annonsdata.platsannons.ansokan.webbplats);
                            $("#ansok").html("Ansök via webbplats");


                        }

                        if(annonsdata.platsannons.ansokan.epostadress){
                            $("#ansok").attr("href","mailto:"+annonsdata.platsannons.ansokan.epostadress);
                            $("#ansok").html("Ansök via e-post ");
                            $("#ansokanInfo").html("Ansökan skickas till: "+annonsdata.platsannons.ansokan.epostadress);
                        }
                        if(!annonsdata.platsannons.ansokan.epostadress && !annonsdata.platsannons.ansokan.webbplats){
                            $("#ansok").attr("href",annonsdata.platsannons.annons.platsannonsUrl);
                            $("#ansok").html("Visa annons på Platsbanken");

                        }

                        if(!annonsdata.platsannons.arbetsplats.logotypurl){
                            $("#logo").remove();
                        }else{
                            $("#logo").attr("src",annonsdata.platsannons.arbetsplats.logotypurl);
                        }
                        //   $("#").html();
                        //   $("#").html();
                        //    $("#").html();

                        // activeRow.append(divElement);
                        document.getElementById("annons").classList.remove("invisible");

                        document.getElementById("annonshtml").classList.remove("loader");
                    })
                    .fail(function () {
                        $afJobCount.html("Missing data");
                        console.log("Couldn't get job ad from remote service");
                        document.getElementById("annons").classList.remove("invisible");

                        document.getElementById("annonshtml").classList.remove("loader");
                    });

              
                divElement.on($.modal.AFTER_CLOSE, function () {
                    deactivateActiveAnnons();
                });

                divElement.modal({
                    fadeDuration: 0,
                    closeExisting: false,
                    escapeClose: true,
                    clickClose: true,
                    closeText: 'Close',
                    closeClass: '',
                    showClose: true,
                    spinnerHtml: true,
                    modalClass: "modal",
                    showSpinner: true,
                    fadeDelay: 0.0
                });

            }




            //$("#afAnnonsContent").removeClass("invisibles");
        });



    };

    var addAdRow = function (annons) {
        var newRow = document.createElement('div');
        newRow.className = 'afTableRow';
        newRow.id = annons.annonsid;
        //TODO: remove 'data-annonsid' replaced with 'id'
        var attribute = document.createAttribute("data-annonsid");
        attribute.value = annons.annonsid;
        newRow.setAttributeNode(attribute);

        var cell = document.createElement('div');
        cell.className = 'afTableCell';
        var row = document.createElement('div');
        row.className = 'row';

        var adheadElement = document.createElement('div');
        adheadElement.className = 'annonsHead';
        adheadElement.innerHTML = annons.annonsrubrik;
        var jobplaceElement = document.createElement('div');
        jobplaceElement.className = 'jobplace';
        jobplaceElement.innerHTML = annons.arbetsplatsnamn + ', ' + annons.kommunnamn;
        if (annons.sista_ansokningsdag) {

        var dateElement = document.createElement('div');
        dateElement.className = 'date';
        dateElement.innerHTML = 'Sista ansökningsdag: ' + annons.sista_ansokningsdag.slice(0, 10);

        var right = document.createElement('div');
        right.className = 'col-4';
        var left = document.createElement('div');
        left.className = 'col-8';

        }
        $.ajax({
            type: 'HEAD',
            url: "https://api.arbetsformedlingen.se/platsannons/"+annons.annonsid+"/logotyp",
            success: function() {
                var logoElement = document.createElement('img');
                logoElement.className = 'listlogo';
                logoElement.src ="http://api.arbetsformedlingen.se/platsannons/"+annons.annonsid+"/logotyp";
                logoElement.style.cssFloat = 'right';
                logoElement.style.maxWidth ="120px";
                logoElement.style.maxHeight ="100px";
                //logoElement.style.top = "0px";
                //logoElement.style.left = "0px";

                right.appendChild(logoElement);

            },
            error: function() {
                // page does not exist
            }
        });


        left.appendChild(adheadElement);
        left.appendChild(jobplaceElement);
        row.appendChild(left);
        row.appendChild(right);
        if (annons.sista_ansokningsdag) {
            left.appendChild(dateElement);
        }
        cell.appendChild(row);
        newRow.appendChild(cell);
        annonsTableBody.appendChild(newRow);
    };

    var adsURL = function (sida) {

        var afw = $afWidgetContainer[0];
        if (sida) {
            return httpRequestString+"&sida=" + sida + "&antalrader=" + afw.dataset.antalrader;
        } else return httpRequestString+ "&sida=1&antalrader=" + afw.dataset.antalrader;
    };

    function getAds(sida) {
        //TODO: Show waiting gif while fetching data
        // afLoadingImage
        $.getJSON(adsURL(sida), function (annonsdata) {
            totalPages = annonsdata.matchningslista.antal_sidor;
            $pagination.twbsPagination('destroy');
            $pagination.twbsPagination($.extend({}, defaultOpts, {
                    totalPages: totalPages,
                    startPage: sida,
                    initiateStartPageClick: false
                })
            );

            var annonser = annonsdata.matchningslista.matchningdata;

            $(".afTableBody").empty();
            annonser.forEach(function (annons, index, annonser) {
                addAdRow(annons);
            });

        }).fail(function () {
            console.log("Couldn't get job ad from remote service");
        })
    }


})(window, document);


