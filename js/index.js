/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


//Global Variables
var currentPage;
var previousPage = "home";



var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        initApp();
    }
};

app.initialize();

function initApp(){
    currentPage = "home";
    //Add Click Listeners for tabs
    document.querySelector("#tabAdd").addEventListener('click',addClick);
    document.querySelector("#tabHome").addEventListener('click',homeClick);
    document.querySelector("#tabSettings").addEventListener('click',settingsClick);
    
}

//'ADD' PAGE FUNCTIONS
function addClick(){

    var secondStep = false;         //This guy gets flagged the first time the hidekeyboard event gets fired
    var firstDimension = "";
    var secondDimension = "";
    
    //Do none of the following if the user is just clicking on the tab they are already on
    if(currentPage!="add"){
        //empty the current page, build the new page.
        emptyDiv(currentPage);
        //Allows us to rember the page we are coming from for next time
        currentPage = "add";
        
        document.querySelector("#home").className = "hide";
        document.querySelector("#settings").className = "hide";
        document.querySelector("#add").className = "show";
        
        
        //Build html for first step
        var container = document.querySelector("#add");
        var pTag = document.createElement("p");
        pTag.setAttribute("id","instruct");
        pTag.innerHTML = ("Input height or width of display");
        container.appendChild(pTag);
        var inputTag = document.createElement("input");
        inputTag.setAttribute("id","firstInput");
        inputTag.setAttribute("type", "number");
        container.appendChild(inputTag);
        
        //Await user to fill in number and hide keyboard
        document.addEventListener('hidekeyboard', function(){
            
            //If this is the first step, modify instructions to explain second step
            if(!secondStep){
                secondStep = true;
                document.getElementById("instruct").innerHTML = "Now input the second value";
                firstDimension = parseInt(inputTag.value);
                var pTag2 = document.createElement("p");
                pTag2.setAttribute("id","firstDimension");
                pTag2.innerHTML = firstDimension;
                container.insertBefore(pTag2,inputTag);
                inputTag.value = "";
            }
            
            //If this is the second step, grab the values and run the calculation
            else{
                this.removeEventListener('hidekeyboard', arguments.callee);
                secondStep = false;
                secondDimension = parseInt(inputTag.value);
                runCalculation(firstDimension,secondDimension);
            }
            
        }, false);
    }
}

function runCalculation(firstDimension, secondDimension){
    var height = 1;
    var width = 1;
    var ratio;
    var resFound = false;
    
    if (firstDimension > secondDimension){
        width = firstDimension;
        height = secondDimension;
    }
    
    else if (firstDimension < secondDimension){
        width = secondDimension;
        height = firstDimension;
    }
    
    else{
        width = firstDimension;
        height = secondDimension;
    }
    
    //alert("Height: "+height+", Width: "+width+", Ratio: "+ resolutionsData[0].Ratio);
    console.log("length of loop: "+resolutionsData.length);
    for(var i=0; i<resolutionsData.length; i++){
        console.log(resolutionsData[i].Width);
        if(resolutionsData[i].Width == width){
            if(resolutionsData[i].Height == height){
                ratio = resolutionsData[i].Ratio;
                finalAdd(width,height,ratio,true);
                resFound = true;
            }
        
        }
    }
    
    if (!resFound){
        alert("Your resolution is not on my list, I'll attempt to calculate for you.");
        if (height>0 && width>0){
            
            var gcdValue = gcd(width, height);
            var ratio = (width/gcdValue)+":"+(height/gcdValue);
            finalAdd(width,height,ratio,false);
        }
        else{
            alert("Cannot input 0 for either value");
        }
    }
}

//Recursive function I found online. Basically it feeds back into itself 
//attempting to divide height by width until there is no remainder.
function gcd(a,b){
    return (b == 0) ? a : gcd (b, a%b);
}


function finalAdd(width,height,ratio,exact){
    emptyDiv("add");
    var container = document.getElementById("add");
    var pTag = document.createElement("p");
    pTag.innerHTML = "Please confirm adding the following display information";
    var pTag2 = document.createElement("p");
    pTag2.innerHTML = width + " X " + height + ", "+ratio;
    var confirmButton = document.createElement("div");
    confirmButton.setAttribute("id", "addConfirmBtn");
    confirmButton.innerHTML = ("<p>Confirm</p>");
    
    container.appendChild(pTag);
    container.appendChild(pTag2);
    container.appendChild(confirmButton);
    
    confirmButton.addEventListener("click", function(){
        alert("SAVING DATA");
    });
    
    
    
}


function homeClick(){
    
    if(currentPage!="home"){
        emptyDiv(currentPage);
        currentPage = "home";
        document.querySelector("#add").className = "hide";
        document.querySelector("#settings").className = "hide";
        document.querySelector("#home").className = "show";
    }
}

function settingsClick(){
    
    if(currentPage!="settings"){
        emptyDiv(currentPage);
        currentPage = "settings";
        document.querySelector("#home").className = "hide";
        document.querySelector("#add").className = "hide";
        document.querySelector("#settings").className = "show";

    }
}


function emptyDiv(divQuery){
    
    if (divQuery.length>0){
        var myNode = document.getElementById(divQuery);
        while (myNode.firstChild){
            myNode.removeChild(myNode.firstChild);
        } 
    }
}


















