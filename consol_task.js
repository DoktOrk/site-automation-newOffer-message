/*
 * DoktOrk, 20200228: prototype, I shall not be liable for any direct,
 * indirect, incidental, special, consequential or punitive damages,
 * or any loss of profits, opportunities or revenues,
 * whether incurred directly or indirectly, or any loss of data, use, goodwill,
 * or other intangible losses,
 * however, for more support, reach me out :-D
 */

/*
 * Usage:
 * 1.) log in to the site
 * 2.) set your preferences on your search list site then get the url and update the url after the "loadWin = window.open('
 * 3.) click on one of your searches then get the url and update the url after the "let offerLoadWin = window.open('"
 * 4.) set your requestText
 * 5.) set cyclesToRun
 * 6.) set cycleFrequency
 * 7.) set maxRandomTimeDiff
 * 8.) fill up your localStorage.storedOfferIDList with the expose ids of the offers you already applied to
 * 9.) enable popups for the site
 * 10.) reload the page
 * 11.) paste the code in the console and hit enter
 */

let requestText = "";
const cyclesToRun = 360;
const cycleFrequency = 420000; // in milliseconds
const maxRandomTimeDiff = 12000; // in milliseconds

let storedOfferIDs = [];
let windows = [];
let offerWindows = [];
let offerPrintWindows = [];
var loadWin;
let m;

function getRndInteger(min, max) {
    return (Math.floor(Math.random() * (max*2 - min) ) + min) - max; // a very basic randomization against basic bot recognition
}

var k = 0;
function wrapperLoop () {
    setTimeout(function () {
        windows = [];
        loadWin = window.open('https://www...', '_blank');

        windows.push(loadWin);

        var i = 0; // used in myLoop()
        myLoop();


        k++;
        if (k < cyclesToRun) {
            wrapperLoop();
        }
    }, cycleFrequency + getRndInteger(0, maxRandomTimeDiff))
}

function myLoop () {
    setTimeout(function () {

        storedOfferIDs = [];
        if (localStorage.storedOfferIDList) {
            storedOfferIDs = localStorage.storedOfferIDList.split(",");
        } else {
            console.log("localStorage.storedOfferIDList is null");
            let testStringLS = "114682380,89227456,116015493,115930736,114015747,114441145,115183333,115230990,115238303,115266731,84632123,115403633,115408992,115302555,115470678,115586154,115622350,115730412,115773874,115781606".split(",");
            storedOfferIDs = testStringLS // for test
        }

        let offerBtnList = null;
        if (windows[0].document && windows[0].document.getElementsByClassName("get_the_right_element")) {
            offerBtnList = windows[0].document.getElementsByClassName("get_the_right_element");
        }

        if (offerBtnList != null) {
            for (var l = 0; l < offerBtnList.length; l++) {
                let subVal = offerBtnList[l].pathname.substring(8);
                if(storedOfferIDs.includes(subVal)){ //if the ID is already registered
                    console.log("ID is already registered: " + subVal);
                }else{ //if the ID is not yet registered
                    console.log("ID is not yet registered: " + subVal);

                    let offerLoadWin = window.open('https://www.../' + subVal + '.../email', '_blank');
                    offerWindows.push(offerLoadWin);

                    //let offerPrintWin = window.open('https://www.../' + subVal + '/print', '_blank');
                    //offerPrintWindows.push(offerPrintWin);

                }
            }
        }else{
            console.log("the list of the offer-buttons is empty, waiting for the next cycle...");
        }


        m = 0; // used in senderLoop()
        senderLoop();

        i++;
        if (i < 1) {
            myLoop();
        }
    }, 16000)
}

function senderLoop () {
    setTimeout(function () {

        if (offerWindows.length == 0) {
            console.log("there are no new offers right now");
        }

        for (var o = 0; o < offerWindows.length; o++) {
            let msgBox = null;
            if (offerWindows[o].document && offerWindows[o].document.getElementById("get_the_right_element")) {
                msgBox = offerWindows[o].document.getElementById("get_the_right_element");
            }
            if (msgBox != null) {
                msgBox.focus();
                msgBox.value = requestText; // !!! .value and .innerHTML do not have effect on the sent text!!! I am still working on it.

                let sendBtn = null;
                if (offerWindows[o].document && offerWindows[o].document.getElementsByClassName("get_the_right_element")[0]) {
                    sendBtn = offerWindows[o].document.getElementsByClassName("get_the_right_element")[0];
                }
                if (sendBtn != null) {
                    if (sendBtn.firstChild.innerHTML.indexOf("button_text") >= 0) {
                        msgBox.focus();
                        sendBtn.click();
                        storedOfferIDs.push(offerWindows[o].changeThis.expose.id);
                        let joinedStoredOfferIDs = storedOfferIDs.join();
                        localStorage.storedOfferIDList = joinedStoredOfferIDs;

                        if (localStorage.siteBotCycleCount_success) {
                            localStorage.siteBotCycleCount_success = Number(localStorage.siteBotCycleCount_success) + 1;
                        }else{
                            console.log("siteBotCycleCount_success is null");
                            localStorage.siteBotCycleCount_success = 1;
                        }
                        console.log("automated messages successfully sent: " + localStorage.siteBotCycleCount_success);

                    }else if (sendBtn.firstChild.innerHTML.indexOf("button_text") >= 0) {
                        console.log("wrong window: do nothing, waiting for the next cycle...");
                    }
                }else{
                    console.log("the send-button does not exist, waiting for the next cycle...");
                }
            }else{
                console.log("the message-box does not exist, waiting for the next cycle...");
            }

            //offerWindows[o].close(); // keep the new offer window open in case the original offer was deleted
        }
        offerWindows = [];

        for (var p = 0; p < offerPrintWindows.length; p++) {
            let printBtn = offerPrintWindows[p].document.getElementById("get_the_right_element");
            //printBtn.click();
        }
        offerPrintWindows = [];


        windows[0].close();


        if (localStorage.siteBotCycleCount) {
            localStorage.siteBotCycleCount = Number(localStorage.siteBotCycleCount) + 1;
        }else{
            console.log("siteBotCycleCount is null");
            localStorage.siteBotCycleCount = 1;
        }
        console.log("Cycle: " + localStorage.siteBotCycleCount + ": done.");


        m++;
        if (m < 1) {
            console.log("senderLoop load multiple times...");
            senderLoop();
        }
    }, 30000)
}

wrapperLoop();
