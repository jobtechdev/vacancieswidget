# Vacancies Widget v 0.3

This goes with out saying: "This is still work in progress." ;) ,
se [TODO]( https://github.com/jobtechdev/vacancieswidget/blob/master/TODO.md).


Usages
------
The easiest way of using the Vacancies Widget is to look in the example/index file.
Add the references to script and needed css files at the end of the html file from our host.

``` html
...
...
<link href="http://netdna.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" type="text/css" href="http://52.169.31.165/css/AfPbWidget.css">
<script src="http://52.169.31.165/script/AfPbWidget.js"></script>
</body>
</html>
```

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
