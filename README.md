![alt text][logo]

[logo]: https://github.com/MagnumOpuses/project-meta/blob/master/img/jobtechdev_black.png "JobTech dev logo"
[A JobTech Project]( https://www.jobtechdev.se)

# Vacancies Widget v 0.9
Use at you own risk.
This widget is using a backend service that not yet is in production mode, therefore no promises about robustness or correctness.
The api endpoint can be altered with no notice and effect the widget function.<BR>
[Here you have aworking example](https://widgets.jobtechdev.se/vaccancies/index.html)<BR>
Do you want to help? Get involved!
see [CONTRIBUTING]( https://github.com/MagnumOpuses/vaccancieswidget/blob/master/CONTRIBUTING.md)

## Getting started
You can choose to host on premises or use our host in the cloud, it's your choice.<br>
### Docker
`%> sudo docker build -t <Image name> -f Dockerfile`
<br> run
<br> `%>sudo docker run -it  -p 8080:8080 <Image name>`
<br> access test page
<br> `http://localhost:8080/vaccancies/index.html`

## Usages

The easiest way of using the Vacancies Widget is to add references to our hosted script and needed css files at the end of the html file. See Snippet 1.
and then place a clickable element 'afWidgetContainer' according to your preferences. See Ex.1 and Ex.2

You need to provide either kommunid, yrkesgruppid or yrkesid if you want to show all jobadds for a region.
If you want to show all adds for a company you can provide organisationsnummer.

[Here](https://widgets.jobtechdev.se/vaccancies/) you have the html tag working on an empty page

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
