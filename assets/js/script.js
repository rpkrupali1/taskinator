var taskIdCounter = 0;
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var pageContentE1 = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var tasks = [];

var taskFormHandler  = function (event) {
  event.preventDefault();
  var taskNameInput = document.querySelector("input[name='task-name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;

  // check if input values are empty strings
  if (!taskNameInput || !taskTypeInput) {
    alert("You need to fill out the task form!");
    return false;
  }

  formEl.reset();

  var isEdit = formEl.hasAttribute("data-task-id");
  if(isEdit){
    var taskId = formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInput,taskTypeInput,taskId);
  }
  else{
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput,
        status: "to do"
    };
    // send it as an argument to createTaskEl
    createTaskEl(taskDataObj);
  }
};

var completeEditTask = function(taskName, taskType,taskId){
  // find the matching task list item
  var taskSelected = document.querySelector(".task-item[data-task-id='"+ taskId + "']");
  // set new values
  taskSelected.querySelector("h3.task-name").textContent = taskName;
  taskSelected.querySelector("span.task-type").textContent = taskType;

  for (let i = 0; i < tasks.length; i++) {
    if(tasks[i].id===parseInt(taskId)){
      tasks[i].name = taskName;
      tasks[i].type = taskType;
    }
  }
  alert("task updated");
  formEl.removeAttribute("data-task-id");
  document.querySelector("#save-task").textContent = "Add Task";

  //save to local storage
  saveTasks();
};

var createTaskEl = function(taskDataObj) {
  // create list item
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";

  // add task id as a custom attribute
  listItemEl.setAttribute("data-task-id",taskIdCounter);

  // create div to hold task info and add to list item
  var taskInfoEl = document.createElement("div");
  taskInfoEl.className = "task-info";
  // add HTML content to div
  taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
  listItemEl.appendChild(taskInfoEl);

  var taskActionE1 = createTaskActions(taskIdCounter);
  listItemEl.appendChild(taskActionE1);

  // add entire list item to list
  tasksToDoEl.appendChild(listItemEl);

  taskDataObj.id = taskIdCounter;
  tasks.push(taskDataObj);

  //save to local storage
  saveTasks();

  // increase task counter for next unique id
  taskIdCounter++;
}

var createTaskActions = function(taskId) {
  var actionContainerEl = document.createElement("div");
  actionContainerEl.className = "task-actions";
  // create edit button
  var editButtonEl = document.createElement("button");
  editButtonEl.textContent = "Edit";
  editButtonEl.className = "btn edit-btn";
  editButtonEl.setAttribute("data-task-id",taskId);
  actionContainerEl.appendChild(editButtonEl);
  //create delete button
  var deleteButtonE1 = document.createElement("button");
  deleteButtonE1.textContent = "Delete";
  deleteButtonE1.className = "btn delete-btn";
  deleteButtonE1.setAttribute("data-task-id",taskId);
  actionContainerEl.appendChild(deleteButtonE1);
  //create dropdown
  var statusSelectE1 = document.createElement("select");
  statusSelectE1.className = "select-status";
  statusSelectE1.setAttribute("name","status-change");
  statusSelectE1.setAttribute("data-task-id",taskId);
  var statusChoices = ["To Do","In Progress","Completed"];
  for (let i = 0; i < statusChoices.length; i++) {
    //create option element
    var statusOptionE1 = document.createElement("option");
    statusOptionE1.textContent = statusChoices[i];
    statusOptionE1.setAttribute("value",statusChoices[i]);
    //append to select
    statusSelectE1.appendChild(statusOptionE1);
  }
  actionContainerEl.appendChild(statusSelectE1);
  return actionContainerEl;
};

var deleteTask = function(taskId){
  var taskSelected = document.querySelector(".task-item[data-task-id='"+ taskId + "']");
  taskSelected.remove();

  // create new array to hold updated list of tasks
  var updatedTaskArr = [];

  // loop through current tasks
  for (let i = 0; i < tasks.length; i++) {
    if(tasks[i].id!==parseInt(taskId)){
      updatedTaskArr.push(tasks[i]);
    }
  }
  // reassign tasks array to be the same as updatedTaskArr
  tasks = updatedTaskArr;

  //save to local storage
  saveTasks();
};

var editTask = function(taskId){
  var taskSelected = document.querySelector(".task-item[data-task-id='"+ taskId + "']");
  var taskName = taskSelected.querySelector("h3.task-name").textContent;
  var taskType = taskSelected.querySelector("span.task-type").textContent;
  document.querySelector("input[name='task-name']").value = taskName;
  document.querySelector("select[name='task-type']").value = taskType;
  document.querySelector("#save-task").textContent = "Save Task";
  formEl.setAttribute("data-task-id", taskId);
};

var taskButtonHandler = function(event){
  //when edit button is clicked
  if(event.target.matches(".edit-btn")){
    var taskId = event.target.getAttribute("data-task-id");
    editTask(taskId);
  }
  // when delete button is clicked
  else if(event.target.matches(".delete-btn")){
    var taskId = event.target.getAttribute("data-task-id");
    deleteTask(taskId);
  }
};

var taskStatusChangeHandler = function(event) {
  // get the task item's id
  var taskId = event.target.getAttribute("data-task-id");

  // get the currently selected option's value and convert to lowercase
  var statusValue = event.target.value.toLowerCase();
  
  // find the parent task item element based on the id
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  if (statusValue === "to do") {
    tasksToDoEl.appendChild(taskSelected);
  }
  else if (statusValue === "in progress") {
    tasksInProgressEl.appendChild(taskSelected);
  } 
  else if (statusValue === "completed") {
    tasksCompletedEl.appendChild(taskSelected);
  }

  //update task's in task[] array
  for (let i = 0; i < tasks.length; i++) {
    if(tasks[i].id===parseInt(taskId)){
      tasks[i].status=statusValue;
    }
  }

  //save to local storage
  saveTasks();
};

//save tasks to local storage
var saveTasks = function(){
  localStorage.setItem("tasks",JSON.stringify(tasks));
};

formEl.addEventListener("submit", taskFormHandler);
pageContentE1.addEventListener("click",taskButtonHandler);
pageContentE1.addEventListener("change", taskStatusChangeHandler);