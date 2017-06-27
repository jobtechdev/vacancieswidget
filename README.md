# Vacancies Widget v 0.3

This goes with out saying: "This is still work in progress." ;) ,
se [TODO]( https://github.com/jobtechdev/vacancieswidget/blob/master/TODO.md).


Usages
------
Usage with no changes to AfPbWidget.js, requires catalogues structure
according to the catalogue structure in the example directory.
ie. You need to have all resource directories in same directory where you use tAdPbWidget

```
 'Your file with widget'.html - |-  css   |- AfPbWidget.css
                                |
                                |- images |- logo-af-white.svg
                                |
                                |- script |- AfPbWidget.js
                                          |- jquery.modal.js
                                          |- paginatio.js
```


Add snippet to your html page, se example.
note: only one tag, of 'afWidgetContainer' and 'afJobCount', is allowed on a html page.

Ex. 1
```html
<div id="afWidgetContainer" data-lanid="25" data-kommunid="2510" data-antalrader="10">
    <div style="width: 150px; align-content: center; border: 1px solid black; border-radius: 5px; background-color: #00B9EA">
        <div style="display: table; margin: 0 auto">Find employment in Jokkmokk</div>
        <div id="afJobCount" data-lanid="25" data-kommunid="2510"
             style=" font-style: normal; text-align: center; font-weight: 800;  color: white; background-color: #0044AB; ">
        </div>
        <div style="text-align: center;">jobs to apply</div>
    </div>
</div>
```


Ex. 2
```html
<div id="afWidgetContainer" data-lanid="25" data-kommunid="2510" data-antalrader="10">
</div>
```

Known issues
------------
- (Possible)Conflict with bootstrap.css (3.3.7) and modal script.
