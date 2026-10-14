const notificationbtn =document.getElementById("notification-btn");
const themebtn = document.getElementById("theme-btn");
const settingsbtn=document.getElementById("settings-btn");

const focusmode=document.getElementById("focusmode");
const breakmode = document.getElementById("breakmode");
const freestylemode=document.getElementById("free-stylemode");

const modellabel=document.getElementById("modellabel")
const timerdisplay= document.getElementById("timer")
const timerstatus=document.getElementById("timer-status")

const startbtn=document.getElementById("start-btn");
const stopbtn=document.getElementById("stop-btn");
const resetbtn=document.getElementById("reset-btn");

const sessioncount=document.getElementById("session-count");
const sessionremain=document.getElementById("session-remain");

const modes={
    focus:{
        label:"Focus Time",
        duration:25*60
    },
    shortBreak:{
        label:"Short Break",
        duration:5*60
    },
    longBreak:{
        label:"Long Break",
        duration:15*60
    }
};

let currentmode="focus";
let timeleft=modes[currentmode].duration;
let timerinterval=null;
let completedsessions=Number
(localStorage.getItem("focusBloomsessions"))||0;


function updatetimerdisplay(){
    const min=Math.floor(timeleft/60);
    const sec=timeleft%60;

    timerdisplay.textContent=
    String(min).padStart(2,"0")+":"+
    String(sec).padStart(2,"0");
}
function updatesessionprogress()
{
    sessioncount.textContent=completedsessions;
    const completedincycle=completedsessions%4;

    const remaining=completedincycle===0 ? (completedsessions===0?4:0):
    4-completedincycle;

    sessionremain.textContent=remaining;

}
function starttimer()
{
    if(timerinterval!==null || timeleft==0){
        return;
    }
    timerstatus.textContent=modes[currentmode].label+" in progress...";

    timerinterval=setInterval(function(){
        timeleft--;
        updatetimerdisplay();
        
        if(timeleft===0){
            clearInterval(timerinterval);
            timerinterval=null;
            if(currentmode==="focus"){
                completedsessions++;

                localStorage.setItem(
                    "focusbloomsessions",
                    completedsessions
                );
                updatesessionprogress();
                timerstatus.textContent="focus session completed";

            }
            else{
                timerstatus.textContent="break completed!";
            }
        }
    },1000);
}

function pausetimer()
{
    if(timerinterval!==null)
    {
        clearInterval(timerinterval);
        timerinterval=null;
        timerstatus.textContent="Timer paused.";
    }
}

function resettimer()
{
    clearInterval(timerinterval);
    timerinterval=null;
    timeleft=modes[currentmode].duration;

    updatetimerdisplay();
    timerstatus.textContent="ready to start?";
}

function changemode(mode){
    clearInterval(timerinterval);
    timerinterval=null;

    currentmode=mode;
    timeleft=modes[currentmode].duration;

    focusmode.classList.toggle("active",mode==="focus");
    breakmode.classList.toggle("active",mode==="shortBreak");
    freestylemode.classList.toggle("active",mode==="longBreak");

    modellabel.textContent=modes[currentmode].label;
    timerstatus.textContent="ready to start?";
    updatetimerdisplay();
}

startbtn.addEventListener("click",starttimer);
stopbtn.addEventListener("click",pausetimer);
resetbtn.addEventListener("click",resettimer);

focusmode.addEventListener("click",function(){
    changemode("focus");
});

breakmode.addEventListener("click",function(){
    changemode("shortBreak");
});

freestylemode.addEventListener("click",function()
{
    changemode("longBreak");
});

changemode("focus");
updatesessionprogress();


function timer()
{
    console.log("hello world");
    console.log("it is new to this")
    console.log("it is not a great life")
}

