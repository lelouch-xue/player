/**
 * 封装的方法以及用法
 import { openDB,
            addData,
            getDataByKey,
            cursorGetData,
            getDataByIndex,
            cursorGetDataByIndex,
            updateDB,
            deleteDB,
            cursorDelete,
            closeDB,
            deleteDBAll } from './indexedDb.js'
    openDB('myDB', 'one').then(db => {  
      // 打开 / 创建 Indexed 数据 
      // addData(db, 'one', { id: 1, name: '张三', age: 24 }) // 新增数据
      // addData(db, 'one', { id: 2, name: '李四', age: 30 }) // 新增数据
      // getDataByKey(db, 'one', 1) // 通过主键读取数据
      // cursorGetData(db, 'one') // 通过游标读取数据
      // getDataByIndex(db, 'one','name', '张三') // 通过索引读取数据
      // cursorGetDataByIndex(db, 'one', 'name', '张三') // 通过索引和游标查询记录
      // updateDB(db, 'one', { id: 1, name: '张三', age: 25 }) // 更新数据
      // deleteDB(db, 'one', 2) // 删除数据
      // cursorDelete(db, 'one', 'name', '张三') // 通过索引和游标删除指定的数据
      // closeDB(db) // 关闭数据库
    })
    // deleteDBAll('myDB') // 删除数据库 慎用!!!!!!!!!!
 */

import { _debugLog } from "./utils";

/**
 * 打开数据库
 * @param {object} dbName 数据库的名字
 * @param {string} storeName 仓库名称
 * @param {string} version 数据库的版本
 * @return {object} 该函数会返回一个数据库实例
 */
export function openDB(dbName, storeName, version = 1) {
  return new Promise((resolve, reject) => {
    //  兼容浏览器
    var indexedDB =
      window.indexedDB ||
      window.mozIndexedDB ||
      window.webkitIndexedDB ||
      window.msIndexedDB;
    let db;
    const request = indexedDB.open(dbName, version);
    request.onsuccess = function (event) {
      db = event.target.result; // 数据库对象
      _debugLog("db", "数据库打开成功");
      resolve(db);
    };

    request.onerror = function (event) {
      _debugLog("db", "数据库打开报错");
    };

    request.onupgradeneeded = function (event) {
      // 数据库创建或升级的时候会触发
      _debugLog("db", "onupgradeneeded");
      db = event.target.result; // 数据库对象
      var objectStore;
      if (!db.objectStoreNames.contains(storeName)) {
        objectStore = db.createObjectStore(storeName, { keyPath: "id" }); // 创建表
        objectStore.createIndex("name", "name", { unique: false }); // 创建索引 可以让你搜索任意字段
        // objectStore.createIndex('address', 'address', { unique: false })
        // objectStore.createIndex('nameAddr', ['name', 'address'], {
        //  unique: false,
        // })
        // objectStore.createIndex('flag', 'flag', { unique: false })
      }
    };
  });
}

/**
 * 新增数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} data 数据
 */
export function addData(db, storeName, data) {
  var request = db
    .transaction([storeName], "readwrite") // 事务对象 指定表格名称和操作模式（"只读"或"读写"）
    .objectStore(storeName) // 仓库对象
    .add(data);

  request.onsuccess = function (event) {
    _debugLog("db", "数据写入成功");
  };

  request.onerror = function (event) {
    _debugLog("db", "数据写入失败");
    throw new Error(event.target.error);
  };
}

/**
 * 通过主键读取数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} key 主键值
 */
export function getDataByKey(db, storeName, key) {
  return new Promise((resolve, reject) => {
    var transaction = db.transaction([storeName]); // 事务
    var objectStore = transaction.objectStore(storeName); // 仓库对象
    var request = objectStore.get(key);

    request.onerror = function (event) {
      _debugLog("db", "事务失败");
    };

    request.onsuccess = function (event) {
      _debugLog("db", "主键查询结果: ", request.result);
      resolve(request.result);
    };
  });
}

/**
 * 通过游标读取数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 */
export function cursorGetData(db, storeName) {
  let list = [];
  var store = db
    .transaction(storeName, "readwrite") // 事务
    .objectStore(storeName); // 仓库对象
  var request = store.openCursor(); // 指针对象
  request.onsuccess = function (e) {
    var cursor = e.target.result;
    if (cursor) {
      // 必须要检查
      list.push(cursor.value);
      cursor.continue(); // 遍历了存储对象中的所有内容
    } else {
      _debugLog("db", "游标查询结果：", list);
    }
  };
}

/**
 * 通过索引读取数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} indexName 索引名称
 * @param {string} indexValue 索引值
 */
export function getDataByIndex(db, storeName, indexName, indexValue) {
  var store = db.transaction(storeName, "readwrite").objectStore(storeName);
  var request = store.index(indexName).get(indexValue);
  request.onerror = function () {
    _debugLog("db", "事务失败");
  };
  request.onsuccess = function (e) {
    var result = e.target.result;
    _debugLog("db", "索引查询结果：", result);
  };
}

/**
 * 通过索引和游标查询记录
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} indexName 索引名称
 * @param {string} indexValue 索引值
 */
export function cursorGetDataByIndex(db, storeName, indexName, indexValue) {
  let list = [];
  var store = db.transaction(storeName, "readwrite").objectStore(storeName); // 仓库对象
  var request = store
    .index(indexName) // 索引对象
    .openCursor(IDBKeyRange.only(indexValue)); // 指针对象
  request.onsuccess = function (e) {
    var cursor = e.target.result;
    if (cursor) {
      // 必须要检查
      list.push(cursor.value);
      cursor.continue(); // 遍历了存储对象中的所有内容
    } else {
      _debugLog("db", "游标索引查询结果：", list);
    }
  };
  request.onerror = function (e) {};
}

/**
 * 更新数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {object} data 数据
 */
export function updateDB(db, storeName, data) {
  var request = db
    .transaction([storeName], "readwrite") // 事务对象
    .objectStore(storeName) // 仓库对象
    .put(data);

  request.onsuccess = function () {
    _debugLog("db", "数据更新成功");
  };

  request.onerror = function () {
    _debugLog("db", "数据更新失败");
  };
}

/**
 * 删除数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {object} id 主键值
 */
export function deleteDB(db, storeName, id) {
  var request = db
    .transaction([storeName], "readwrite")
    .objectStore(storeName)
    .delete(id);

  request.onsuccess = function () {
    _debugLog("db", "数据删除成功");
  };

  request.onerror = function () {
    _debugLog("db", "数据删除失败");
  };
}

/**
 * 通过索引和游标删除指定的数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} indexName 索引名
 * @param {object} indexValue 索引值
 */
export function cursorDelete(db, storeName, indexName, indexValue) {
  var store = db.transaction(storeName, "readwrite").objectStore(storeName);
  var request = store
    .index(indexName) // 索引对象
    .openCursor(IDBKeyRange.only(indexValue)); // 指针对象
  request.onsuccess = function (e) {
    var cursor = e.target.result;
    var deleteRequest;
    if (cursor) {
      deleteRequest = cursor.delete(); // 请求删除当前项
      deleteRequest.onerror = function () {
        _debugLog("db", "游标删除该记录失败");
      };
      deleteRequest.onsuccess = function () {
        _debugLog("db", "游标删除该记录成功");
      };
      cursor.continue();
    }
  };
  request.onerror = function (e) {};
}

/**
 * 关闭数据库
 * @param {object} db 数据库实例
 */
export function closeDB(db) {
  db.close();
  _debugLog("db", "数据库已关闭");
}

/**
 * 删除数据库
 * @param {object} dbName 数据库名称
 */
export function deleteDBAll(dbName) {
  _debugLog("db", dbName);
  let deleteRequest = window.indexedDB.deleteDatabase(dbName);
  deleteRequest.onerror = function (event) {
    _debugLog("db", "删除失败");
  };
  deleteRequest.onsuccess = function (event) {
    _debugLog("db", "删除成功");
  };
}
