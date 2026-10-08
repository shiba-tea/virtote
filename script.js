let dataList = document.getElementsByTagName("tbody")[0];
const inputButton = document.getElementById("input-button");
const editButton = document.getElementById("edit-button");
const deleteButton = document.getElementById("delete-button");
let inputData; // リストに描画するデータ(オブジェクト)
let editing = false; // 編集中フラグ


// サンプルデータ
const sampleData = [
  {item:"じゃがいも", quantity:"1個", memo:"メークイン"},
  {item:"たまねぎ", quantity:"1個", memo:"多ければ多いほど良い"},
  {item:"にんじん", quantity:"1本", memo:""},
  {item:"鶏肉", quantity:"300g", memo:"もも"},
  {item:"カレールー", quantity:"1箱", memo:"中辛"}
];

// LocalStorageへの保存
function saveData(){
  localStorage.setItem("shoppingData", JSON.stringify(shoppingData));
}

// LocalStorageからの削除
function deleteData(){
  localStorage.removeItem("shoppingData");
}


// リスト描画
function renderList(inputdata){
  let renderItem;
  if(!editing){ //編集中ではない リスト描画/編集枠描画
      renderItem =`
        <td>${inputdata.item}</td>
        <td>${inputdata.quantity}</td>
        <td>${inputdata.memo}</td>
      `;
  } else {
      renderItem =`
        <td><input type="text" value="${inputdata.item}"></td>
        <td><input type="text" value="${inputdata.quantity}"></td>
        <td><textarea>${inputdata.memo}</textarea></td>
      `;
  }
  dataList.innerHTML +=
    `<tr><td><input type="checkbox" ${inputdata.checked ? "checked" : ""}></td>${renderItem}</tr>`;

    let checkbox =  dataList.rows[dataList.rows.length - 1]
    .cells[0]
    .querySelector("input");

    checkbox.addEventListener("change", function(){
      inputdata.checked = this.checked;
      if( !editing && shoppingData.length > 0){
        saveData();
      }
    });
  }


// 初期表示
  //localstorageデータを配列に戻して格納/なければ空配列を格納
let shoppingData = JSON.parse(localStorage.getItem("shoppingData")) || [];
let displayData = shoppingData.length > 0 ? shoppingData : sampleData; // LocalStorageのデータ有無確認
for (let i = 0; i < displayData.length; i++) { 
inputData = displayData[i];
  renderList(inputData);
}

// 追加処理関数
let inputItem = document.getElementById("input-item");
let inputQuantity = document.getElementById("input-quantity");
let inputMemo = document.getElementById("input-memo"); 

function addItem(){
  inputData = {
    item : inputItem.value,
    quantity : inputQuantity.value,
    memo : inputMemo.value
  }

  shoppingData.push(inputData);

  if(!editing){ // 編集中でなければ
  saveData();
  }

  inputItem.value = ""; //入力枠を空にする
  inputQuantity.value = "";
  inputMemo.value = "";

  renderList(inputData);
}

// 追加 クリックイベント
inputButton.addEventListener("click",function(){
  if(inputItem.value === ""){ //入力欄が空で追加ボタンを押されても処理しない
    return; 
  }
  // Localデータがない/サンプルデータが表示されていたら消す
  if( shoppingData.length === 0){
    dataList.innerHTML = "";
  }
  addItem();
});

// 購入済削除　クリックイベント
deleteButton.addEventListener("click",function(){
  // 1行ずつ購入済みチェックの確認/入っていれば行を削除
  for (let i = dataList.rows.length - 1; i >= 0; i--) { //dataListの件数-1 新→旧へ
    let checkbox = dataList.rows[i].cells[0].querySelector("input");
    if (checkbox.checked) { // チェックボックスにチェックが入っている
      dataList.deleteRow(i);  // リストの該当行を削除
      if(shoppingData.length > 0){ // shoppingDataが1件以上
        shoppingData.splice(i,1); //チェックされた行のデータを削除
      }
    }
  }
  if(editing){
    return;
  }
  if(!editing && shoppingData.length > 0){ // shoppingDataが１件以上あり編集中でない
    saveData();
  } else {
    deleteData();
  }
});

// 並べ替え クリックイベント


// 編集 クリックイベント
editButton.addEventListener("click",function(){
  editing = !editing; // true:編集状態 false:閲覧状態
  for (let i = 0; i < dataList.rows.length; i++) {  // リストの行だけ繰り返す
    let row = dataList.rows[i]; // 行の格納
    if (!editing){ // false 閲覧状態 入力枠から値を読んでセルへ
      let item = row.cells[1].querySelector("input").value;
      let quantity = row.cells[2].querySelector("input").value;
      let memo = row.cells[3].querySelector("textarea").value;

      if( shoppingData.length > 0){ // LocalStorageがあるとき、shoppingDataにデータを格納
        shoppingData[i] = {
          item: item,
          quantity: quantity,
          memo: memo,
          checked: row.cells[0].querySelector("input").checked
        };
      }

      row.cells[1].textContent = item;
      row.cells[2].textContent = quantity;
      row.cells[3].textContent = memo;

    } else { // true 編集状態　 セルの中身を入力枠へ
      row.cells[1].innerHTML = ("<input type='text' value=" + row.cells[1].textContent + ">");
      row.cells[2].innerHTML = ("<input type='text' value=" + row.cells[2].textContent + ">");
      row.cells[3].innerHTML = ("<textarea>" + row.cells[3].textContent + "</textarea>");
    }
  }
  if(editing){ // 編集状態なら
    editButton.value = "保存";
  } else {
    saveData();
    editButton.value = "編集";
  }
});