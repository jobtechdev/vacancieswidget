# Vacancies Widget V 0.3

This goes with out saying: "This is still work in progress.", free of use and alter the code ;)

Usages
------

Add snippet to html page, se example.
note: only one tag, of each, is allowed on a html page.

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
