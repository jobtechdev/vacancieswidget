(function (window, document) {

    var jQuery, $;
    var baseUrl = 'http://api.arbetsformedlingen.se/af/v0/platsannonser/';
    var $pagination,
        $afWidgetContainer,
        defaultOpts,
        annonsTableBody,
        afModal,
        activeRow;

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
            getScript('http://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.js', function () {
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

        var httpRequestString;
        var  $afJobCount = $('#afJobCount');

        //Used to load script dependencies
        function loadScripts(array, callback) {
            var loader = function (src, handler) {
                var script = document.createElement("script");
                script.src = src;
                script.onload = script.onreadystatechange = function () {
                    script.onreadystatechange = script.onload = null;
                    handler();
                };
                var head = document.getElementsByTagName("head")[0];
                (head || document.body).appendChild(script);
            };
            (function run() {
                if (array.length != 0) {
                    loader(array.shift(), run);
                } else {
                    callback && callback();
                }
            })();
        }


        if ($afJobCount.length) {
            if($afJobCount[0].dataset.lanid) {
                httpRequestString = baseUrl + "matchning?lanid=" + $afJobCount[0].dataset.lanid + "&kommunid=" + $afJobCount[0].dataset.kommunid + "&sida=0&antalrader=1";

                //Get 'antal_platsannonser'
                $.getJSON(httpRequestString, {
                    format: "json"
                })
                    .done(function (annonsdata) {
                        totalPages = annonsdata.matchningslista.antal_platsannonser;
                        $afJobCount[0].innerHTML = totalPages;
                    })
                    .fail(function () {
                        $afJobCount.html("Missing data");
                        console.log("Couldn't get job ad from remote service");
                    });
            }else{
                $afJobCount.html("Check tag parameter.");
            }
        }

        loadScripts(["http://52.169.31.165/script/pagination.js", "http://52.169.31.165/script/jquery.modal.js"], function () {

            $.modal.defaults = {
                fadeDuration: 200,
                closeExisting: true,
                escapeClose: true,
                clickClose: true,
                closeText: 'Close',
                closeClass: '',
                showClose: true,
                spinnerHtml: null,
                modalClass: "modal",
                showSpinner: true,
                fadeDelay: 1.0
            };

            $('body').prepend("<div id='afmodal' class='modal' style='display: none'></div>");

            afModal = $("#afmodal");

            afModal.load('http://52.169.31.165/template/templates.html', '#afmodal-content', function (response, status, xhr) {
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

        $afWidgetContainer = $('#afWidgetContainer');
        //Show The Window
        $afWidgetContainer[0].onclick = function () {
            $('#afmodal').modal();
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

        //TODO this should be changed in new layout...

        var divElement = $('#afAnnonsContent');
        if (activeRow.find(divElement).length) {
            divElement.remove();
            activeRow.removeClass('afRowActive');
        } else {

            divElement = $(document.createElement('div'));
            divElement.attr('id', 'afAnnonsContent');
            divElement.addClass('modal');

            iframeElement = $(document.createElement('iframe'));
            iframeElement.attr('id', 'afAnnonsFrame');
            iframeElement.attr('src', baseUrl + annonsid + "/typ=html");

            var infoDiv = $(document.createElement('div'));
            infoDiv.attr('id', 'afAnnonsInfo');
            infoDiv
                .html('<a id="afSeekAnnonsButton" href="https://www.arbetsformedlingen.se/Tjanster/Arbetssokande/Platsbanken/annonser/'
                    + annonsid + '" target="_blank">Sök jobbet!</a>');

            activeRow.append(divElement);
            divElement.append(iframeElement);
            divElement.append(infoDiv);

            divElement.on($.modal.AFTER_CLOSE, function () {
                deactivateActiveAnnons();
            });

            divElement.modal({
                closeExisting: false
            });
        }

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
        var adheadElement = document.createElement('div');
        adheadElement.className = 'annonsHead';
        adheadElement.innerHTML = annons.annonsrubrik;
        var jobplaceElement = document.createElement('div');
        jobplaceElement.className = 'jobplace';
        jobplaceElement.innerHTML = annons.arbetsplatsnamn + ', ' + annons.kommunnamn;

        cell.appendChild(adheadElement);
        cell.appendChild(jobplaceElement);

        newRow.appendChild(cell);
        annonsTableBody.appendChild(newRow);
    };

    var adsURL = function (sida) {
        var afw = $afWidgetContainer[0];
        if (sida) {
            return baseUrl + "matchning?lanid=" + afw.dataset.lanid + "&kommunid="+afw.dataset.kommunid+"&sida=" + sida + "&antalrader=" + afw.dataset.antalrader;
        } else return baseUrl + "matchning?lanid=" + afw.dataset.lanid +"&kommunid="+afw.dataset.kommunid+ "&sida=1&antalrader=" + afw.dataset.antalrader;
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

