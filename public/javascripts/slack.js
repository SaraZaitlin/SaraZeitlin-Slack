

let slack=(function (){
    let publicData={};

    //A function that is activated every 10 seconds and checks by a fetch request if the list of the last 5 messages needs to be updated.
     publicData.updateMessage=function (){

         window.location.assign("/checkUpdate");
         setTimeout(slack.updateMessage, 10000);
    };
    return publicData;
})();

document.addEventListener('DOMContentLoaded', function(){
    console.log("start")
     setTimeout(slack.updateMessage, 10000)
    //Page view below
    window.scrollTo(0, document.body.scrollHeight);
}, false);