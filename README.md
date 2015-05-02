# bootstrap-validator
Validator for Bootstrap based form.

## これは何？
bootstrapのフォームのバリデーションライブラリです。  
実際にはjqueryのプラグインとして動作します。

### 使い方
form要素に対して、validate()メソッドが追加されます。

```js
$('form').validate(rules, callback);
```

rulesはバリデーションのルール（無名関数）の配列になります。
バリデーションの結果によって、生じたエラーはdata-error属性にセットします。

```html
<form>
  <div class='form-group'>
    <label>名前</label>
    <input type='text' class='form-control' />
  </div>
</form>
```

```js
$('form').validate([
  function(form){
    if(form('#name').val() == ''){
      form('#name').data('error', '入力されていません。');
    }
  }
]);
```

エラーはbootstrapのツールチップとして表示されます。

validate()はjQuery.Deferredを返します。 
エラーが発生しなかった場合は、done()コールバックが実行されます。  
callback関数が定義されている場合は、その返り値がdone()コールバックに渡されます。


```js
$('form').validate([    // rules
  function(form){
    if(form('#name').val() == ''){
      form('#name').data('error', '入力されていません。');
    }
  }
],
function(form){         // callback
  return form('#name').val();
})
.done(function(name){
  alert('名前: ' . name);
});
```
