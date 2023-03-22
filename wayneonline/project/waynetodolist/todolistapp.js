// 抓from button放到add
let add = document.querySelector("form button");
let section = document.querySelector("section");
add.addEventListener("click", (e) => {
  //   console.log(e);
  e.preventDefault();
  //避免提交表單時重整
  //   console.log(e.target.parentElement);
  //form，我們要Learn跟3跟4資訊
  let form = e.target.parentElement;
  //   console.log(form.children);
  let todoText = form.children[0].value;
  let todoMonth = form.children[1].value;
  let todoDate = form.children[2].value;
  //   console.log(todoText, todoMonth, todoDay);

  //bug解決文字沒填也能提交表單
  if (todoText === "") {
    alert("Please Enter some text");
    return;
    //加return直接結束掉,不會執行下面
  }

  let todo = document.createElement("div");
  todo.classList.add("todo");
  //clsaa=todo
  let text = document.createElement("p");
  text.classList.add("todo-text");
  //class=todo-text
  text.innerText = todoText;
  //輸入的文字
  let time = document.createElement("p");
  time.classList.add("todo-time");
  //class=todo-time
  time.innerText = todoMonth + " / " + todoDate;
  todo.appendChild(text);
  todo.appendChild(time);
  //todo這個屬性有text有time

  //create green check按下綠色按鈕事件
  let greenButton = document.createElement("button");
  greenButton.classList.add("green");
  greenButton.innerHTML = '<i class="fas fa-check"></i>';
  //按下完成
  greenButton.addEventListener("click", (e) => {
    // console.log(e.target);
    //注意勾勾跟綠色外框,要避免案到icon,去CSS設定i的pointer-events: none;
    // console.log(e.target.parentElement);
    let todoItem = e.target.parentElement;
    // todoItem.classList.add("done");
    todoItem.classList.toggle("done");
    //用toggle讓點第2次時會消掉class
  });

  let redButton = document.createElement("button");
  redButton.classList.add("red");
  redButton.innerHTML = '<i class="fas fa-trash"></i>';

  //點擊紅色案紐會消掉整個代辦事項,
  redButton.addEventListener("click", (e) => {
    // console.log(e.target.addEventListener);
    //我們希望他的parentelement消失
    let todoItem = e.target.parentElement;
    // console.log(todoItem);
    // todoItem.remove();
    //要加入EventListener在animationend時做arrow function
    todoItem.addEventListener("animationend", () => {
      //remove local storage-----------------------------------------------------------------------
      let text = todoItem.children[0].innerText;
      let myListArray = JSON.parse(localStorage.getItem("list"));
      myListArray.forEach((item, index) => {
        if (item.todoText == text) {
          myListArray.splice(index, 1);
          localStorage.setItem("list", JSON.stringify(myListArray));
        }
      });
      //貼上去redbutton----------------------------------------------------------------------------
      todoItem.remove();
    });

    todo.style.animation = "scaleDown 0.3s forwards";
  });

  todo.appendChild(greenButton);
  todo.appendChild(redButton);

  todo.style.animation = "scaleUp 0.3s forwards";

  // create an object, put into localstorage
  let myTodo = {
    todoText: todoText,
    todoMonth: todoMonth,
    todoDate: todoDate,
  };

  //store data into an array of objects,to local storage
  let myList = localStorage.getItem("list");
  // console.log(myList); //null
  // 要分2邊來做
  if (myList == null) {
    localStorage.setItem("list", JSON.stringify([myTodo]));
  } else {
    // 如果他之前就有存東西
    let myListArray = JSON.parse(myList);
    myListArray.push(myTodo);
    localStorage.setItem("list", JSON.stringify(myListArray));
  }
  // Key   Value
  // list  [{"todoText":"Learn python","todoMonth":"3","todoDate":"10"},{"todoText":"Buy Eggs","todoMonth":"1","todoDate":"20"}]

  //clear the text input
  form.children[0].value = "";

  section.appendChild(todo);
  //section現在有todo這個屬性
  //section.todo.text有class跟time有class
});

loadData();

function loadData() {
  //去localStorage抓資料
  let myList = localStorage.getItem("list");
  if (myList !== null) {
    let myListArray = JSON.parse(myList);
    myListArray.forEach((item) => {
      //create a todo
      let todo = document.createElement("div");
      todo.classList.add("todo");
      let text = document.createElement("p");
      text.classList.add("todo-text");
      text.innerText = item.todoText;
      let time = document.createElement("p");
      time.classList.add("todo-time");
      time.innerText = item.todoMonth + " / " + item.todoDate;
      todo.appendChild(text);
      todo.appendChild(time);

      //-----------------------------------------------------------------------------------------------------------
      //create green check按下綠色按鈕事件
      let greenButton = document.createElement("button");
      greenButton.classList.add("green");
      greenButton.innerHTML = '<i class="fas fa-check"></i>';
      //按下完成
      greenButton.addEventListener("click", (e) => {
        // console.log(e.target);
        //注意勾勾跟綠色外框,要避免案到icon,去CSS設定i的pointer-events: none;
        // console.log(e.target.parentElement);
        let todoItem = e.target.parentElement;
        // todoItem.classList.add("done");
        todoItem.classList.toggle("done");
        //用toggle讓點第2次時會消掉class
      });
      let redButton = document.createElement("button");
      redButton.classList.add("red");
      redButton.innerHTML = '<i class="fas fa-trash"></i>';

      //點擊紅色案紐會消掉整個代辦事項,
      redButton.addEventListener("click", (e) => {
        // console.log(e.target.addEventListener);
        //我們希望他的parentelement消失
        let todoItem = e.target.parentElement;
        // console.log(todoItem);
        // todoItem.remove();
        //要加入EventListener在animationend時做arrow function
        todoItem.addEventListener("animationend", () => {
          //remove local storage-----------------------------------------------------------------------
          let text = todoItem.children[0].innerText;
          let myListArray = JSON.parse(localStorage.getItem("list"));
          myListArray.forEach((item, index) => {
            if (item.todoText == text) {
              myListArray.splice(index, 1);
              localStorage.setItem("list", JSON.stringify(myListArray));
            }
          });
          //貼上去redbutton----------------------------------------------------------------------------
          todoItem.remove();
        });

        todo.style.animation = "scaleDown 0.3s forwards";
      });
      //-------------------------------------------------------------------------------------------------------------
      todo.appendChild(greenButton);
      todo.appendChild(redButton);
      section.appendChild(todo);
    });
  }
}

//Q加了很多代辦事項,刪除後他仍占有一個位置,雖然他變小了scale=0,他仍在html文件
//A加入.remove();而且要加入EventListener在animationend時做arrow function
//Q表單提交沒重整,但字留在裡面
//A 加上  form.children[0].value = "";
//Q文字月份日期沒有填也能交表單
//A //bug解決文字沒填也能提交表單if (todoText === "") {
//Q讀完local stroge按下F5東西仍跑出來->刪掉仍出現
//Ared button不能只刪除todoItem.remove();,要改成去刪除localStorage

// merge sort
//Number() string改成nuber的方式
function mergeTime(arr1, arr2) {
  let result = [];
  let i = 0;
  let j = 0;

  while (i < arr1.length && j < arr2.length) {
    if (Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)) {
      result.push(arr2[j]);
      j++;
    } else if (Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)) {
      result.push(arr1[i]);
      i++;
    } else if (Number(arr1[i].todoMonth) == Number(arr2[j].todoMonth)) {
      if (Number(arr1[i].todoDate) > Number(arr2[j].todoDate)) {
        result.push(arr2[j]);
        j++;
      } else {
        result.push(arr1[i]);
        i++;
      }
    }
  }
  //剩下沒有比較到的要放回array
  while (i < arr1.length) {
    result.push(arr1[i]);
    i++;
  }
  while (j < arr2.length) {
    result.push(arr2[j]);
    j++;
  }

  return result;
}

function mergeSort(arr) {
  if (arr.length === 1) {
    return arr;
  } else {
    let middle = Math.floor(arr.length / 2);
    let right = arr.slice(0, middle);
    let left = arr.slice(middle, arr.length);
    return mergeTime(mergeSort(right), mergeSort(left));
  }
}

// // // 驗證
console.log(mergeSort(JSON.parse(localStorage.getItem("list"))));
// //2月>12月 因為他只比較第一個數字 要改善加Number(arr1[i].todoMonth)

let sortButton = document.querySelector("div.sort button");
sortButton.addEventListener("click", () => {
  // sort data
  let sortedArray = mergeSort(JSON.parse(localStorage.getItem("list")));
  localStorage.setItem("list", JSON.stringify(sortedArray));

  // remove data
  let len = section.children.length;
  for (let i = 0; i < len; i++) {
    section.children[0].remove();
  }

  // load data
  loadData();
});
