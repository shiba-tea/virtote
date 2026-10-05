let dataArea = document.getElementById("data-area");
let dataList = document.getElementsByTagName("tbody")[0];
let inputItem = document.getElementById("input-item");
let inputQuantity = document.getElementById("input-quantity");
let inputMemo = document.getElementById("input-memo"); 
const inputButton = document.getElementById("input-button");
const editButton = document.getElementById("edit-button");
const deleteButton = document.getElementById("delete-button");

// サンプルデータ
let sampleData = [
  ["じゃがいも", "1個", "メークイン"],
  ["たまねぎ", "1個", "多ければ多いほど良い"],
  ["にんじん", "1本", ""],
  ["鶏肉", "300g", "もも"],
  ["カレールー", "1箱", "中辛"]
];

// 入力内容を取得
function getData(){
  return{
  item : inputItem.value,
  quantity : inputQuantity.value,
  memo : inputMemo.value
}}

// リストに書込み
function listEdit(){
}

// 初期表示
let shoppingData = JSON.parse(localStorage.getItem("shoppingData")) || [];
if( shoppingData.length > 0){
  //LocalStrageがある
  for (let i = 0; i < shoppingData.length; i++) {
    dataList.innerHTML +=
      "<tr><td><input type='checkbox'></td><td>" + shoppingData[i].item +
      "</td><td>" + shoppingData[i].quantity + "</td><td>" +
      shoppingData[i].memo + "</td></tr>";
  }
} else {
  //LocalStrageがない
  for(let i = 0; i < sampleData.length; i++){
  dataList.innerHTML +=
    "<tr><td><input type='checkbox'></td><td>" + sampleData[i][0] +
    "</td><td>" + sampleData[i][1] + "</td><td>" + sampleData[i][2] + "</td></tr>"; 
  }
}

// 追加処理
inputButton.addEventListener("click",function(){
  if(inputItem.value === ""){
    console.log("入力無し") // 後で消す
    return; 
  }
  let data = getData();

  // Localデータがない/サンプルデータが表示されていたら消す
  if( shoppingData.length === 0){
    dataList.innerHTML = "";
  }

  // 入力内容の保存
  shoppingData.push(data);
  localStorage.setItem("shoppingData", JSON.stringify(shoppingData));

  console.log("品目：" + data.item);
  console.log("数量：" + data.quantity);
  console.log("備考：" + data.memo);

  inputItem.value = "";
  inputQuantity.value = "";
  inputMemo.value = "";

  dataList.innerHTML +=
    "<tr><td><input type='checkbox'></td><td>" + data.item +
    "</td><td>" + data.quantity + "</td><td>" + data.memo + "</td></tr>"; 
});

// 編集
let editing = false
editButton.addEventListener("click",function(){
  if (editing === false){
    for (let i = 0; i < dataList.rows.length; i++) {
      let rows = dataList.rows[i];

      let itemCell = rows.cells[1];
      let quantityCell = rows.cells[2];
      let memoCell = rows.cells[3];

      let item = itemCell.textContent;
      let quantity = quantityCell.textContent;
      let memo = memoCell.textContent;

      dataList.rows[i].cells[1].innerHTML = ("<input type='text' value=" + item + ">");
      dataList.rows[i].cells[2].innerHTML = ("<input type='text' value=" + quantity + ">");
      dataList.rows[i].cells[3].innerHTML = ("<textarea>" + memo + "</textarea>");

      editing = true;
      editButton.value = "保存";
    }
  } else {

  // 編集終了/保存
    for(let i = 0; i < dataList.rows.length; i++){
      let rows = dataList.rows[i];

      let item = rows.cells[1].querySelector("input").value;
      let quantity = rows.cells[2].querySelector("input").value;
      let memo = rows.cells[3].querySelector("textarea").value;

      rows.cells[1].textContent = item;
      rows.cells[2].textContent = quantity;
      rows.cells[3].textContent = memo;
    }

    editButton.value = "編集";
    editing = false;
  }
});

// 購入済削除
deleteButton.addEventListener("click",function(){
  // 1行ずつ購入済みチェックの確認/入っていれば行を削除
  for (let i = dataList.rows.length - 1; i >= 0; i--) {
    let checkbox = dataList.rows[i].cells[0].querySelector("input");
    if (checkbox.checked) {
      dataList.deleteRow(i);
      if(shoppingData.length > 0){
        shoppingData.splice(i,1);
      }
    }
  }
  if(shoppingData.length > 0){
    localStorage.setItem("shoppingData", JSON.stringify(shoppingData));
  }
});