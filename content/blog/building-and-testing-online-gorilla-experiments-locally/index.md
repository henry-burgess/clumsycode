---
title: Building and testing online Gorilla experiments locally
date: "2021-08-05"
description: A potential solution for JavaScript developers looking to create experiments for Gorilla on their machines locally.
tags: ["🧠", "👨‍💻"]
---

_A potential solution for JavaScript developers looking to create experiments for Gorilla on their machines locally._

After spending time myself developing experiments that were to run locally in a laboratory and online via Gorilla, I decided to spend some time trying to work out a way that I could streamline my development such that I would only have to modify code in one location - on my laptop in the comfort of my own development environment and configuration.

## Using JavaScript with Gorilla

Gorilla allows users to create a _jsPsych Starter_ project that includes a template JavaScript (JS) file and resources that allow the user to integrate jsPsych projects into Gorilla. Gorilla has a nice online IDE that facilitates development.

The main advantage of writing JS inside the Gorilla online IDE is having easy integration with the Gorilla API.

The `main` file created by Gorilla in the experiment template is initialised with the following contents:

```js
import gorilla = require("gorilla/gorilla");

// Make sure to upload the jsPsych files you need to the resources tab.
// This should include the main jsPsych.js, jsPsych.css and likely at least one plugin. 
// In this case, we use the jspsych-html-keyboard-response.js plugin file.
var jsPsych = window['jsPsych'];

gorilla.ready(function(){

  var timeline = []; 

  var hello_trial = {
    type: 'html-keyboard-response',
    stimulus: 'Hello world!'
  }

  timeline.push(hello_trial);

  jsPsych.init({
    display_element: $('#gorilla')[0],
    timeline: timeline,
    on_data_update: function(data){
      gorilla.metric(data);
    },
    on_finish: function(){
      gorilla.finish();
    }
  });
})
```

From here, there are two ways of working with JS in Gorilla:

1. _Method One:_ Modify source code using the online IDE. This method is safe, and will work almost all of the time. There will be very few unexpected errors. I personally think the online IDE is quite nice, particularly for smaller experiments!
2. _Method Two:_ Write JS locally, modifying and copying it inside the `gorilla.ready` function when it is ready to be tested in Gorilla. Based on my experience using this method, there are many traps that you can fall into, and many repetitive operations when copying code from the local development environment to Gorilla. If you want to split your code into multiple files, there is no safety when referencing `export`-ed objects and classes. This method can lead to carnage if not thoroughly tested.

What if I want to add some other exciting third-party libraries like WebGazer? Use 3D stimuli built with WebGL or WebAssembly? React even? As it stands, there is no easy way to facilitate this kind of integration with Gorilla.

The solution I propose will accomplish the following goals:

1. One codebase that is operable in both the local development environment and on the Gorilla platform.
2. Ability to bundle additional third-party libraries such as React, WebGazer, and WebAssembly executables.
3. Develop experiments using TypeScript or JavaScript (TS / JS).
4. Streamline development of online experiments using Gorilla by enabling use of modern web development tools such as WebPack.

A solution to these challenges would allow developers to compile the code to test at least the functionality and appearance locally, and the only functionality unable to be tested locally would be the Gorilla API calls.

The bedrock of this solution I am proposing is essentially a targeted build system. Conceptually, there are two build targets: `desktop` (local development environment), and `gorilla` (online on the Gorilla platform). Build target `desktop` is the target used when building and testing the task locally, and the `gorilla` build is only run before uploading or integrating the task with the Gorilla platform.

## Local development

Before I start explaining my solution, I would be well-served explaining the primary challenge I encountered along the way. Hopefully if someone knows a better way to address this, they may be able to help me out!

Based on the contents of the `main` file above, we can see straight away that there will be issues when trying to run and test this code locally.

The primary issue, on line 1, is the `import gorilla = require("gorilla/gorilla");` call. The `gorilla/gorilla` package is not publicly available via NPM, so this is the first thing that will not be possible locally. This is the linkage to the API used throughout the code.

Later in the file, we see calls to `gorilla.ready`, `gorilla.metric`, and `gorilla.finish`, all essential functions when integrating the task to the Gorilla API.

We can be confident when building and testing the game in a local development environment, it is not possible to test the specific API calls.

If you’d like to check out the entire codebase for an experiment that uses this method, check out the GitHub repository here: [https://github.com/henry-burgess/experiments](https://github.com/henry-burgess/experiments) I’ve set it up as a GitHub ‘template’ so hopefully people can use it a bit easier.

**Disclaimer:** You won’t be able to run the code snippets without some setup or configuration. The code snippets below are intended to be pseudocode that hopefully explain my intentions and strategy to developing a solution. If you want to know more of the intricacies of the configuration, check out the repository, or skip down to the ‘How do I run it?’ section. Better yet, try it out for yourself and let me know how you go!

### Digging into the code

Let’s get started with the easy part - deciding what code to run at execution time. This part of the system relies somewhat on JS being a ‘scripting’ language, opposed to a compiled language. I specified a `config.js` file which held, amongst other parameters, the build target string (`gorilla` or `desktop`). I created a new basic `if` block like the following:

```js
// Initialise jsPsych and Gorilla (if required)
if (config.target === 'gorilla') {
  // ...
} else if (config.target === 'desktop') {
  // ...
}
// ...
```

Now we can easily specify what code we want to run on each target platform.

### `window` objects

An important (and somewhat hacky) concept that underlies this solution is the existence of objects in `window` space. These objects are somewhat similar to global variables, and can be accessed like any other JS object by calling `window['object-name']`. When an `import` statement is compiled and then eventually executed, some imported libraries may configure a new `window` object. Fortunately for us, that’s exactly what jsPsych and Gorilla do. At runtime, `window['jsPsych']` and `window['gorilla']` (only if the code is running on Gorilla though) objects exist.

What’s the catch with this method? Well, we can only reliably access `window` objects after the window has loaded. So, I will wrap the `if` statement above in a function called when the window has finished loading. This function is the `window.onload` function. We end up with the following code:

```js
// ...
window.onload = () => {
  const timeline = []

  // Define your timeline here!

  if (config.target === 'gorilla') {
    // Wait for the entire page to be loaded before accessing jsPsych and Gorilla
    const _gorilla = window['gorilla'];
    const _jsPsych = window['jsPsych'];
    // ...
  } else if (config.target === 'desktop') {
    // Wait for the entire page to be loaded before accessing jsPsych and Gorilla
    const _jsPsych = window['jsPsych'];
    // ...
  }
}
// ...
```

You’ll see that I’ve also included variables inside the `if` blocks that store `window['jsPsych']` and `window['gorilla']` as required. We only need jsPsych for the desktop target, but we need both Gorilla and jsPsych for the Gorilla version.

In any subsequent code inside the `if` blocks will be run depending on the platform specified in the configuration file.

### Targeting `desktop`

Let’s start with an easy win, setting up the `desktop` configuration. The first thing to do is to check that jsPsych has actually been loaded successfully. The easiest way to catch most possible errors is to wrap the `jsPsych.init` method in an `if` block like so:

```js
// ...
} else if (config.target === 'desktop') {
  // Wait for the entire page to be loaded before accessing jsPsych and Gorilla
  const _jsPsych = window['jsPsych'];
  if (_jsPsych) {
    // jsPsych.init block here...
  } else {
    console.error('Fatal: jsPsych not loaded.');
  }
}
// ...
```

You’ll see I added an error message if for some reason the variable comes back `undefined`.

Next I need to make sure I `import ...` any other jsPsych plugins that I plan to be using in my timeline. This should be done at the top of the file.

Finally, I can then call the `jsPsych.init` method using my parameters of choice, but note how the `_jsPsych` variable is used below:

```js
import 'jspsych/jspsych'
import 'jspsych/plugins/jspsych-instructions'
// ...
} else if (config.target === 'desktop') {
  // Wait for the entire page to be loaded before accessing jsPsych and Gorilla
  const _jsPsych = window['jsPsych'];

  if (_jsPsych) {
    _jsPsych.init({
      timeline: timeline,
      on_finish: function() {
        // ...
      },
      // ...
    });
  } else {
    console.error('Fatal: jsPsych not loaded.');
  }
}
// ...
```

That’s it for `desktop`! Hopefully you see there is a simple logical sequence like so:

- Get the jsPsych `window` object.
- If it is defined, continue.
  - If it is not defined, stop execution.
- Load any plugins that were used in the experiment timeline.
- Call the `jsPsych.init` method.

Let’s move onto the final boss, getting the `gorilla` target working!

### Targeting `gorilla`

I will start with the code snippet below that is inside the `window.onload` function:

```js
// ...
if (config.target === 'gorilla') {
  // Wait for the entire page to be loaded before accessing jsPsych and Gorilla
  const _gorilla = window['gorilla'];
  const _jsPsych = window['jsPsych'];
  // ...
}
// ...
```

The next step is to confirm that Gorilla and jsPsych have been loaded correctly, raising an error if not:

```js
import 'jspsych/jspsych'
import 'jspsych/plugins/jspsych-instructions'
// ...
if (config.target === 'gorilla') {
  // Wait for the entire page to be loaded before accessing jsPsych and Gorilla
  const _gorilla = window['gorilla'];
  const _jsPsych = window['jsPsych'];

  if (_gorilla && _jsPsych) {
    // gorilla.ready block here...
  } else {
    console.error(`Fatal: Gorilla or jsPsych not loaded.`);
  }
}
// ...
```

Next, I can add a call to the `gorilla.ready` function, similar to the original online template file:

```js
import 'jspsych/jspsych'
import 'jspsych/plugins/jspsych-instructions'
// ...
if (config.target === 'gorilla') {
  // Wait for the entire page to be loaded before accessing jsPsych and Gorilla
  const _gorilla = window['gorilla'];
  const _jsPsych = window['jsPsych'];

  if (_gorilla && _jsPsych) {
    // Require any jsPsych plugins, so that they are loaded here
    _gorilla.ready(function() {
      // jsPsych.init block here...
    });
  } else {
    console.error(`Fatal: Gorilla or jsPsych not loaded.`);
  }
}
// ...
```

Finally, I can essentially paste in the `jsPsych.init` call from the original template file inside the `gorilla.ready` API call. I just need to replace any `jsPsych` references with `_jsPsych`, and any `gorilla` references with `_gorilla` like so:

```js
import 'jspsych/jspsych'
import 'jspsych/plugins/jspsych-instructions'
// ...
if (config.target === 'gorilla') {
  // Wait for the entire page to be loaded before accessing jsPsych and Gorilla
  const _gorilla = window['gorilla'];
  const _jsPsych = window['jsPsych'];

  if (_gorilla && _jsPsych) {
    // Require any jsPsych plugins, so that they are loaded here
    _gorilla.ready(function() {
      _jsPsych.init({
        display_element: $('#gorilla')[0],
        timeline: timeline,
        on_data_update: function(data){
          _gorilla.metric(data);
        },
        on_finish: function(){
          _gorilla.finish();
        }
      });
    });
  } else {
    console.error(`Fatal: Gorilla or jsPsych not loaded.`);
  }
}
// ...
```

And that’s it! That’s the essence of coding up the two alternate implementation depending on whether the target is `gorilla` or `desktop`.

You should have something that generally resembles the snippet below:

```js
import 'jspsych/jspsych'
import 'jspsych/plugins/jspsych-instructions'
// ...
window.onload = () => {
  const timeline = []

  // Define your timeline here!

  if (config.target === 'gorilla') {
    // Wait for the entire page to be loaded before initialising jsPsych and Gorilla
    // Once all modules are loaded into the window, access Gorilla API and jsPsych library
    const _gorilla = window['gorilla'];
    const _jsPsych = window['jsPsych'];
  
    // Make sure Gorilla and jsPsych are loaded
    if (_gorilla && _jsPsych) {
      _gorilla.ready(function() {
        _jsPsych.init({
          display_element: $('#gorilla')[0],
          timeline: timeline,
          on_data_update: function(data) {
            _gorilla.metric(data);
          },
          on_finish: function() {
            _gorilla.finish();
          },
        });
      });
    } else {
      console.error(`Fatal: Gorilla or jsPsych not loaded.`);
    }
  } else if (config.target === 'desktop') {
    // Once all modules are loaded into the window, access jsPsych library
    const _jsPsych = window['jsPsych'];
  
    // Make sure jsPsych is loaded
    if (_jsPsych) {
      _jsPsych.init({
        timeline: timeline,
        on_finish: function() {
  
        },
      });
    } else {
      console.error(`Fatal: jsPsych not loaded.`);
    }
  }
}
```

## How am I using this?

The repository I’ve setup here is an example: [https://github.com/henry-burgess/experiments](https://github.com/henry-burgess/experiments). It would take many words to try and explain how to configure the tools exactly how I have them setup now!

### Desktop

To develop the experiment locally, I firstly check that the `target` in `src/config/config.js`  is set to `desktop`. Running `yarn dev` starts a local development server that will re-compile the code on any changes. I can then preview the experiment in the browser on my local machine. I am now ready to make any changes to the code I want to. If I want to add a new dependency (e.g., React, WebGazer, etc.), I simply install the dependency using `yarn` and can use it however I wish in the experiment.

If I want to deploy the experiment for a laboratory context, I can go ahead and run `yarn build`. This will generate a HTML and `*.bundle.js` file in the `built/` subdirectory. These two files are all that is required to run the experiment offline on a laboratory computer.

### Gorilla

As explained in the ‘Desktop’ section above, I can easily go about developing the experiment and previewing the experiment in my browser.

If I want to generate a Gorilla build, I usually run `yarn clean` to remove any old build artefacts, set the `target` in `src/config/config.js`  to `gorilla`, and run `yarn build`. This will generate a HTML and `*.bundle.js` file in the `built/` subdirectory. I then upload the `*.bundle.js` file as a ‘Resource’ in my Gorilla experiment. If this is the first time testing the experiment on Gorilla, I need to set the ‘Head’ contents in Gorilla to the following (replacing `*.bundle.js` with the actual name of your resource):

```html
<script src="{{resource '*.bundle.js'}}"></script>
```

I can then click ‘Preview’ and see the experiment running online in Gorilla!

To update the Gorilla version, I simply run a new build locally, and then re-upload the `*.bundle.js` file as a ‘Resource’.

## Tooling

Here’s a bit more detail below about the tools and how I specifically used them.

### TypeScript

I used TypeScript for this project, requiring me to configure a TS compiler. The configuration I have currently allows JS, TS, and JSX / TSX to all reside together and be bundled. TS also provides a bit more confidence in typing, catching a few potential bugs when compiling it to JS.

### WebPack

WebPack acted as the pipeline that would compile the TS code and bundle any dependencies.

Additionally, you may have noticed a `$` symbol in the `gorilla` target code. This was a reference to the jQuery library that Gorilla uses. I added jQuery as a dependency and imported it into the file also:

```js
// Import jQuery to build for Gorilla
import $ from 'jquery';
```
  
I also made use of the WebPack development server, which would reload the in-browser preview each time I made a change. I needed to then incorporate the `HtmlWebpackPlugin` that would generate a HTML file alongside the bundled code enabling the preview to be rendered in the browser. You can see the exact configuration in the `webpack.config.js` file in the root of the repository.

### React

I was able to easily incorporate React into the example project linked above. I created a `screens.tsx` file which I plan to fill out with a few examples showcasing the capabilities of this project. Currently, I have tested a number of React UI libraries, including _React Bootstrap_ ([https://react-bootstrap.github.io/](https://react-bootstrap.github.io/ "React Bootstrap")), _Chakra UI_ ([https://chakra-ui.com/](https://chakra-ui.com/)), and currently _Grommet_ ([https://v2.grommet.io/](https://v2.grommet.io/)). I did encounter issues with _Chakra UI_ in Gorilla, but that is why the Gorilla builds should be tested frequently when playing around with third-party libraries. _React Bootstrap_ and _Grommet_ both work fine.

## Conclusion

Let’s revisit the goals of this little project:

1. One codebase that is operable in the local development environment and on the Gorilla platform.
2. Ability to bundle additional third-party libraries such as React, WebGazer, and even WebAssembly executables.
3. Develop experiments using TypeScript or JavaScript (TS / JS).
4. Streamline development of online experiments using Gorilla by enabling use of modern web development tools such as WebPack.

Firstly, we’ve allowed a distinction to be made between the `desktop` and `gorilla` build targets. The code initialising jsPsych is subtly different between the two targets, however it allows jsPsych to be configured correctly for each target.

Secondly, since we are using modern development tools such as TypeScript, WebPack, and `yarn`, we are able to add dependencies and import them as required. This includes React and WebGazer which are both integrated with the repository. Additionally, I have had success creating a basic 3D game in Unity, exporting it to the HTML5 / WebGL target, and loading the WASM module both in the desktop and Gorilla builds.

Thirdly, this has already been covered above, but TS and JS are supported in the codebase. Additionally, TSX and JSX formats can be used given that React is well-supported.

Finally, the entire process has been simplified and streamlined, making use of modern development tools. The use of these tools has made it possible to create experiments that run both locally and on Gorilla. These tools have opened online experimentation to an enormous collection of open-source libraries that will hopefully lead to exciting and adventurous online experiments being created in the future.

I would appreciate any feedback that more experienced web developers may have on this project! I am somewhat new to web development, so any testing would be much-appreciated also.

## Corrections and Updates

### Update 27 November 2021

You’ll see in most of the code snippets that interact with Gorilla or jsPsych, I make use of inline `require()` statements. This is not a good idea, and I have learnt otherwise recently. Fortunately it is an easy adjustment to make, simply substitute the `require()` statements for identical `import ...` statements at the top of the file. If you had been following along anyway, you should have included `import 'jspsych/jspsych'`. It is simply a matter of `import`-ing rather than `require()`-ing.

I have updated the code snippets accordingly.
