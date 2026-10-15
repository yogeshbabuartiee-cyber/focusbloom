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

const taskform=document.getElementById("taskform");
const taskinput=document.getElementById("taskinput");
const tasklist=document.getElementById("tasklist");
const taskcount=document.getElementById("taskcount");

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
                shownotification("focus session complete! time for a break.")
                timerstatus.textContent="focus session completed";

                const nextmode=
                completedsessions%4==0?"longBreak" : "shortBreak";

                changemode(nextmode);
                timerstatus.textContent=modes[nextmode].label+" is ready.Click start.";

            }
            else{
                shownotification("break complete! ready to focus again");
                changemode("focus")
                timerstatus.textContent="break completed!";
            }
        }
    },1000);
}

notificationbtn.addEventListener("click",async function()
{
    if(!("Notification" in window)){
        timerstatus.textContent="Notifications are not supported.";
        return;
    }
    const permission=await Notification.requestPermission();
    if(permission==="granted")
    {
        notificationbtn.textContent="Notifications Enabled";
        timerstatus.textContent="Notifications enabled";
    }
    else{
        timerstatus.textContent="notifications permission not granted";
    }
})
function shownotification(message){
    if("Notification" in window && Notification.permission ==="granted"){
        new Notification("FocusBloom",{
            body:message
        })
    }
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


let tasks=JSON.parse(localStorage.getItem("focusbloomtasks")) || [];

function savetasks(){
    localStorage.setItem("focusbloomtasks",JSON.stringify(tasks));
}

function rendertasks()
{
    tasklist.innerHTML="";

    tasks.forEach( function (task){
    const li=document.createElement("li");
    const checkbox=document.createElement("input");
    const span=document.createElement("span");
    const deletebtn=document.createElement("button");

    checkbox.type="checkbox";
    checkbox.checked=task.completed;

    span.textContent=task.text;
    deletebtn.textContent="delete";
    deletebtn.className="delete-task";
    deletebtn.type="button";

    if(task.completed){
        li.classList.add("completed");
    }

    checkbox.addEventListener("change",function(){
        task.completed=checkbox.checked;
        savetasks();
        rendertasks();
    })
    deletebtn.addEventListener("click",function(){
        tasks=tasks.filter(function(item){
            return item.id!=task.id;
        });
        savetasks();
        rendertasks();
    })
    li.append(checkbox,span,deletebtn);
    tasklist.appendChild(li);
  });
  const remaining=tasks.filter(function(task){
    return !task.completed;
  }).length;

  taskcount.textContent=remaining+"tasks remaining";

}

taskform.addEventListener("submit",function(event){
    event.preventDefault();
    const text=taskinput.value.trim();

    if(text===""){
        return;
    }
    tasks.push({
        id:Date.now(),
        text:text,
        completed:false
    });
    savetasks();
    rendertasks();
    taskinput.value=""
    taskinput.focus();
});
rendertasks();



