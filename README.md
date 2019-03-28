# Vacancies Widget v 0.3.1

This goes with out saying: "This is still work in progress." ;) ,
see [TODO]( https://github.com/jobtechdev/vacancieswidget/blob/master/TODO.md)

Usages
------
The easiest way of using the Vacancies Widget is to add references to our hosted script and needed css files at the end of the html file. See Snippet 1.
and then place a clickable element 'afWidgetContainer' according to your preferences. See Ex.1 and Ex.2

You need to provide either kommunid, yrkesgruppid or yrkesid if you want to show all jobadds for a region.
If you want to show all adds for a company you can provide organisationsnummer.

To produce an example of integration, I've ripped the front page from Växjö kommun , I hope I'm forgiven.

<img src="http://widget.northeurope.cloudapp.azure.com/kommun/vaxjo/images/vaxjo.png" width="270" height="200">

You can try it out in this [live example](http://widget.northeurope.cloudapp.azure.com/kommun/vaxjo/)

Snippet 1.
``` html
...
...
<script src="https://widgets.jobtechdev.se/vaccancies/script/AfPbWidget.js"></script>
</body>
</html>
```

Add a 'div' tag with id 'afWidgetContainer', where you want to display link do modal job list window and some content inside the 'div', like Ex. 1

note: only one tag,'afWidgetContainer' and/or 'afJobCount', is allowed on a html page.

Ex. 1
```html
<div id="afWidgetContainer" data-lanid="1" data-kommunid="" data-yrkesgruppid="" data-yrkesid="" data-organisationsnummer="" data-antalrader="10">
    <div style="width: 150px; align-content: center; border: 1px solid black; border-radius: 5px; background-color: #00B9EA">
        <div style="display: table; margin: 0 auto">Find employment in Jokkmokk</div>
        <div id="afJobCount" data-lanid="1" data-kommunid="" data-yrkesgruppid="" data-yrkesid="" data-organisationsnummer="" style=" font-style: normal; text-align: center; font-weight: 800;  color: white; background-color: #0044AB; ">
        </div>
        <div style="text-align: center;">jobs to apply</div>
    </div>
</div>
```


It is possible to display number of jobs in a region. se Ex 2.

Ex. 2
```html
<div id="afWidgetContainer" data-lanid="1" data-kommunid="" data-yrkesgruppid="" data-yrkesid="" data-organisationsnummer="" data-antalrader="10">
</div>
```


Known issues
------------
- (Possible)Conflict with bootstrap.css (3.3.7) and modal script.
